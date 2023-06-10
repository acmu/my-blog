// --- DEMO ---

/**
 * 如下是 DEMO 使用，解决『84. 柱状图中最大的矩形』题目
 * https://leetcode.cn/problems/largest-rectangle-in-histogram/description/
 */

```js
var largestRectangleArea = function(heights) {
    let stack=new Stack()
    let left=[]
    let right=[]
    for(let i=0;i<heights.length;i++){
        let ele=heights[i]
        while(!stack.isEmpty()&&stack.peek()[0]>=ele){
            stack.pop()
        }
        if(!stack.isEmpty()){
            left[i]=stack.peek()[1]
        }else {
            left[i]=-1
        }
        stack.push([ele,i])
    }
    stack=new Stack()
    for(let i=heights.length-1;i>=0;i--){
        let ele=heights[i]
        while(!stack.isEmpty()&&stack.peek()[0]>=ele){
            stack.pop()
        }
        if(!stack.isEmpty()){
            right[i]=stack.peek()[1]
        }else {
            right[i]=heights.length
        }
        stack.push([ele,i])
    }
    let res=0
    for(let i=0;i<heights.length;i++){
        let ele=heights[i]
        let cur=ele*(right[i]-left[i]-1)
        res=Math.max(res,cur)
        // console.log(i,cur)
    }
    // console.log(left)
    // console.log(right)
    return res
};
```
