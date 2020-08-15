var products = [
    {
        name: 'product 1',
        price: 2.99,
        location: 'Israel',
        shipingDetails: 'shiping details...',
        show: [ 'price' ]
    },
    {
        name: 'product 2',
        price: 5.99,
        location: 'Israel',
        shipingDetails: 'shiping details...',
        show: [ 'price', 'location' ]
    }
]

var result = []

for (product of products) {
    var data = []
    for (key of product.show) {
        data.push({ [key]: product[key] })
    }
    result.push(data)
}

console.log(result)

