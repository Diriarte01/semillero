const orders =
    [
        {
            customerName: "Nicolas",
            total: 100,
            delivered: true,
        },
        {
            customerName: "Zulema",
            total: 120,
            delivered: false,
        },
        {
            customerName: "Santiago",
            total: 20,
            delivered: false,
        }
    ]

function getTotal(array) {
    let total = 0;
    for (let i = 0; i < array.length; i++) {
        total += array[i].total;
    }
    return console.log(total);
}

getTotal(orders);
