const randomStr = (len) => {
    const arr = '1234567890abcdef'
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    console.log(ans);
    return ans;
}


module.exports = {
    randomStr
}