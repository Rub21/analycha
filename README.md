# Analize OSM Changeset

### Run

```
git clone https://github.com/Rub21/analycha.git
cd analycha/
npm install
node index.js --idchangest = 34439303

```

### Result

for now it will create a json file with nodes example `34439303.json` and give a number of nodes were updated at same distance.
upload your json file at any repository.


http://rub21.github.io/analycha/?json=https://gist.githubusercontent.com/Rub21/7d7ee72221dcf68b3a5c/raw/7c74b59f5b84df8fb330d26305dc5a953d69a205/34439303.json

![image](https://cloud.githubusercontent.com/assets/1152236/10314292/aba00e34-6c19-11e5-95d5-06177cff1d55.png)

The Blue nodes are actual version in changest, the Grey nodes are the previous version.


