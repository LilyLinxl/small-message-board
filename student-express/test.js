function fn(callback) {
    setTimeout(function() {
        var data = 'hello'
        callback(data)
    }, 1000)
}

fn(function(data) {
    console.log(data)
})