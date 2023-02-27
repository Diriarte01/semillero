
let salesOrders = [
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
  ];

sum_sales_orders(salesOrders);

function sum_sales_orders(salesOrders){
    let total = 0;
    for(let i = 0; i < salesOrders.length; i++){
        total += salesOrders[i].total;
    }
    console.log("Ouput: " + total);
}