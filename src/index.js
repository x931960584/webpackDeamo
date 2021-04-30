import '$css/index.css';
import '../asset/index.less';
import '../asset/font/iconfont.css';
const primesion = new Promise((resolve) => {
  setTimeout(() => {
    console.log('----');
    resolve();
  }, 1000);
});
primesion;
