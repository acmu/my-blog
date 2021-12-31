---
title: 二进制探索
date: 2019-09-09 09:09:09
tags: 操作系统
---

如下代码可以展示出 32 位整型的二进制，包含负数的补码

a.ts

```typescript
function toNegative(res: string[]) {
    const len = res.length;
    for (let i = 0; i < len; i++) {
        res[i] = res[i] === '1' ? '0' : '1';
    }
}

function convertPositiveToBase(
    num: number,
    base: number,
    bitNum: number,
): string {
    const res: number[] = new Array(bitNum).fill(0);
    let idx = bitNum - 1;
    while (num !== 0) {
        if (idx >= 0) {
            res[idx] = num % base;
        } else {
            console.log('数字太大，溢出了');
        }
        num = Math.floor(num / base);

        idx--;
    }
    return res.join('');
}

function convertToBase2(
    num: number,
    base: number = 2,
    bitNum: number = 32,
): string {
    if (num >= 0) {
        return '0' + convertPositiveToBase(num, base, bitNum - 1);
    }

    // 负数要使用补码，补码是正数的二进制取反，之后再加一
    const resStr = convertPositiveToBase(-num, base, bitNum - 1);
    const res = resStr.split('');
    toNegative(res);
    const cur = parseInt(res.join(''), 2);
    return '1' + convertPositiveToBase(cur + 1, base, bitNum - 1);
}

console.log(convertToBase2(-2));
console.log(convertToBase2(11));
console.log(convertToBase2(-22));
console.log(convertToBase2(23));
```

输出

```
✗ npx ts-node a.ts
11111111111111111111111111111110
00000000000000000000000000001011
11111111111111111111111111101010
00000000000000000000000000010111
```
