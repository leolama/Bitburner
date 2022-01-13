//original from havoc_mayhem on reddit
//Requires access to the TIX API and the 4S Mkt Data API
let fracL = 0.1;     //Fraction of assets to keep as cash in hand
let fracH = 0.15; //
let commission = 100000; //Buy or sell commission
let numCycles = 2;   //Each cycle is 5 seconds
let totalProfit = 0.0;
let totalLosses = 0.0

/**
 * Refreshes stock data
 * @param {NS} ns Game namespace
 * @param {[]} stocks Stocks to be analyzed
 * @param {[]} myStocks Owned stocks
 */
function refresh(ns, stocks, myStocks) {
    let cashToSpend = ns.getServerMoneyAvailable("home");
    //corpus stores equity (cash + value of all stocks)
    let corpus = cashToSpend;
    myStocks.length = 0;

    //refresh stock data
    for (let i = 0; i < stocks.length; i++) {
        let sym = stocks[i].sym;
        stocks[i].price = ns.stock.getAskPrice(sym);
        stocks[i].maxShares = ns.stock.getMaxShares(sym);
        stocks[i].shares = ns.stock.getPosition(sym)[0];
        stocks[i].buyPrice = ns.stock.getPosition(sym)[1];
        stocks[i].vol = ns.stock.getVolatility(sym);
        //calculate probability of stock price gain/loss
        stocks[i].prob = 2 * (ns.stock.getForecast(sym) - 0.5);
        //calculate expected return
        stocks[i].expRet = stocks[i].vol * stocks[i].prob / 2;
        //add stock equity to corpus
        corpus += stocks[i].price * stocks[i].shares;

        //store owned stocks
        if (stocks[i].shares > 0) {
            myStocks.push(stocks[i]);
        }
    }

    //prunes low-cost stocks that are inefficient
    stocks.forEach(function (_, i) {
        //calculate max purchase cost
        let cost = stocks[i].price * (stocks[i].maxShares - stocks[i].shares);

        //if cost < 1.5% of cash and is unowned
        //then the max purchase for this stock will
        //yield very little profit due to its low
        //stock cost or max shares
        if (cost < 0.015 * cashToSpend && stocks[i].shares == 0) {
            ns.print(`Removed ${stocks[i].sym} from stocks  Max cost: ${format(cost, true)}`);
            stocks.splice(i, 1);
            //remove added equity if stock is pruned
            corpus -= cost;
        }
    });

    //order stocks by profitability %
    stocks.sort(function (a, b) { return b.expRet - a.expRet });

    return corpus;
}

/**
 * Buys stock
 * @param {NS} ns Game namespace
 * @param {[]} stock Stock to buy
 * @param {number} numShares Number of shares to buy
*/
function buy(ns, stock, numShares) {
    let actualPrice = ns.stock.buy(stock.sym, numShares);
    ns.print(`${actualPrice > 0 ? "Bought" : "Failed to buy"} ${format(numShares, false)} shares of ${stock.sym} for ${format(numShares * stock.price, true)}`);
}

/**
 * Sells stock
 * @param {NS} ns Game namespace
 * @param {[]} stock Stock to sell
 * @param {number} numShares Number of shares to sell
*/
function sell(ns, stock, numShares) {
    let profit = numShares * (stock.price - stock.buyPrice) - 2 * commission;

    if (ns.stock.sell(stock.sym, numShares) > 0) {
        let message = `Sold   ${format(numShares, false)} shares of ${stock.sym} for profit of ${format(profit, true)}`;
        ns.print(message);

        //tally gains/losses for efficiency calculation
        if (profit > 0) {
            totalProfit += profit;
            ns.toast(message);
        }
        else { totalLosses += profit; }
    }
    else {
        ns.print(`Failed to sell ${format(numShares, false)} shares of ${stock.sym} for profit of ${format(profit, true)}`);
    }

}

/**
 * Formats big numbers into abbreviated versions
 * @param {number} num Number to format
 * @param {boolean} isMonetary Boolean representation
 * if `num` represents a monetary numerical value or not
*/
function format(num, isMonetary) {
    //define suffixes
    let symbols = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    let i = 0;
    //determine correct suffix
    for (; (Math.abs(num) >= 1000) && (i < symbols.length); i++) num /= 1000;
    //return formatted number
    return ((Math.sign(num) < 0) ? "-" : "") + (isMonetary ? "$" : "") + Math.abs(num).toFixed(3) + symbols[i];
}

/**
 * Program entry point
 * @param {NS} ns Game namespace
 * */
export async function main(ns) {
    //Initialise
    while (!ns.getPlayer().hasTixApiAccess + !ns.getPlayer().has4SDataTixApi) {
        ns.tprint("No access to TIX API and/or 4S Market Data!")
        await ns.sleep(3600000)
    }
    ns.disableLog("ALL");
    let stocks = [];
    let myStocks = [];
    let corpus = 0;
    let symbols = ns.stock.getSymbols();

    //populate stock list and add stock symbols
    for (let i = 0; i < symbols.length; i++) {
        let sym = symbols[i];
        stocks.push({ sym: sym });
    }

    while (true) {
        //refresh equity at beginning of loop
        corpus = refresh(ns, stocks, myStocks);

        //Sell underperforming shares
        for (let i = 0; i < myStocks.length; i++) {
            //if a stock with a higher expected return is found,
            //sell shares of stocks with lower expected returns
            if (stocks[0].expRet > myStocks[i].expRet) {
                sell(ns, myStocks[i], myStocks[i].shares);
                corpus -= commission;
            }
        }

        //Sell shares if not enough cash in hand
        for (let i = 0; i < myStocks.length; i++) {
            if (ns.getServerMoneyAvailable("home") < (fracL * corpus)) {
                //calculate cash needed to replenish cash in hand
                let cashNeeded = (corpus * fracH - ns.getServerMoneyAvailable("home") + commission);
                //calculate number of shares that need to be sold
                let numShares = Math.floor(cashNeeded / myStocks[i].price);
                //sell and remove commission from equity
                sell(ns, myStocks[i], numShares);
                corpus -= commission;
            }
        }

        //Buy shares with cash remaining in hand

        let cashToSpend = ns.getServerMoneyAvailable("home") - (fracH * corpus);
        //calculate max number of shares available
        let maxSharesAvailable = stocks[0].maxShares - stocks[0].shares;
        //calculate max number of shares to buy
        let numShares = Math.min(Math.floor((cashToSpend - commission) / stocks[0].price), maxSharesAvailable);
        //buy additional shares if deemed profitable
        if ((numShares * stocks[0].expRet * stocks[0].price * numCycles) > commission) {
            buy(ns, stocks[0], numShares);
        }

        //calculate and display efficiency and profits/losses
        let efficiency = totalProfit / (totalProfit - totalLosses);
        if(isNaN(efficiency)) { efficiency = 0.0; }
        ns.print(`Efficiency: ${format(efficiency * 100)}%`);
        ns.print(`Profits: ${format(totalProfit, true)} Losses: ${format(totalLosses, true)}`)

        await ns.sleep(5 * 1000 * numCycles + 200);
    }
}
