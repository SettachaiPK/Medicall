import AOS from 'aos';

export async function onMounted(callback=null, getIP=false) {
  AOS.init({ easing: 'ease-in-out-cubic', duration: 750, once: true, offset: 10 });
  if(callback && getIP) {
    const fetch1 = await fetch('https://geolocation-db.com/json/');
    const data1 = await fetch1.json();
    callback(data1.IPv4);
  } else if(callback) {
    callback();
  }
  return true;
};