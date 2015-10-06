# Analize OSM Changeset

### Run

```
git clone https://github.com/Rub21/analycha.git
cd analycha/
npm install
node index.js --idchangest = 34439303

```

### Result

For now the script will create a json file with nodes example `34439303.json` and give in console the numbers of nodes were updated at same distance.

To see the json file  upload at any repository, example [git-34439303.json](https://gist.githubusercontent.com/Rub21/7d7ee72221dcf68b3a5c/raw/7c74b59f5b84df8fb330d26305dc5a953d69a205/34439303.json)

and add the url from json file in `http://rub21.github.io/analycha/?json=`

*Example*
http://rub21.github.io/analycha/?json=https://gist.githubusercontent.com/Rub21/7d7ee72221dcf68b3a5c/raw/7c74b59f5b84df8fb330d26305dc5a953d69a205/34439303.json


![image](https://cloud.githubusercontent.com/assets/1152236/10315687/6758bd5e-6c21-11e5-8f7d-8067e49d9f33.png)

**Where**
- The Blue nodes are actual version in changeset
- The Grey nodes are the previous version
- **2.67** mean the distance that the node was moved


