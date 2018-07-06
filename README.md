# web_final_project
a simple online judge

usage:
```
npm install
node server.js
```
listen on port 3000

增加題目：
1.決定一個唯一ID
2.在/probs新增一個以id為名的資料夾，在該資料夾中放入1.in/1.out/2.in/2.out(預設是兩個測資)
3.在/views/probs編寫prob_$(id).ejs，可參考prob_tem.ejs
4.修改/views/probs/probset.ejs，加入新題目的連結
