```js
// --- DEMO ---

/**
 * 如下是 DEMO 使用，解决『407. 接雨水 II』题目
 */

function compare(a, b) {
    return a[2] - b[2]
}

function trapRainWater(heightMap) {
    let queue = new MyPriorityQueue(compare)

    let m = heightMap.length
    let n = heightMap[0].length

    let vis = []
    let res = 0
    for (let i = 0; i < m; i++) {
        vis[i] = []
        for (let j = 0; j < n; j++) {
            if (i === 0 || i === m - 1 || j === 0 || j === n - 1) {
                queue.enqueue([i, j, heightMap[i][j]])
                vis[i][j] = 1
            }
        }
    }

    while (!queue.isEmpty()) {
        let d = [-1, 0, 1, 0, -1]
        let ele = queue.dequeue()
        for (let j = 0; j < 4; j++) {
            let tx = ele[0] + d[j]
            let ty = ele[1] + d[j + 1]
            if (0 <= tx && tx < m && 0 <= ty && ty < n && vis[tx][ty] !== 1) {
                if (heightMap[tx][ty] < ele[2]) {
                    res += ele[2] - heightMap[tx][ty]
                }
                vis[tx][ty] = 1
                queue.enqueue([tx, ty, Math.max(heightMap[tx][ty], ele[2])])
            }
        }
    }
    return res
};
```