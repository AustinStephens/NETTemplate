export function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export function currencyFormat(amount: number) {
    return '$' + (amount/100).toFixed(2);
}

export function dateFormat(date: string) {
    let arr = date.split('T');
    arr[1] = arr[1].split('.')[0];
    return arr[0] + ' ' + timeFormat(arr[1]);
}

export function timeFormat(time: string) {
    let arr = time.split(':');
    let hourNum = parseInt(arr[0]);

    const suffix = (hourNum >= 12 ? 'pm' : 'am');
    if(hourNum === 0) hourNum = 12;
    else if(hourNum >= 13) hourNum -= 12;

    return hourNum + ':' + arr[1] + suffix;
}