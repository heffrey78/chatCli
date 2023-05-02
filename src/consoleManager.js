
function list(items){
    const length = items.length;
    for(let i = 0; i < length; i++) {
        console.log(`${i}: ${items[i]}`);
    }
}

module.exports = {
    list
}