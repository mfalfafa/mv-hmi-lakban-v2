# mv-hmi-lakban

> An electron-vue project
This is an electron-vue project to is supposed to make HMI (Human Machine Interface) for Raspberry 3. This HMI will count the goods that passed through the Photo sensor that is attached on Raspi 3 pin GPIO25. The value or data from counter will be sent to PC Server every 1 second through Socket protocol. So this project is integrating electron-vue with Socket (net) and GPIO (onoff) Node module.

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

> Settings in Raspi 3
- To make faster in booting
	1. Setting in **"/etc/network/interfaces"** to like this :
	   **"allow-hotplug eth0"**
	   **"iface eth0 inet dhcp"**
	2. Set timeout to 15 in file **"/etc/dhcp/dhclient.conf"**
	   **"timeout=15;"**
	3. In **"raspi-config"** select **"no"** in waiting to connect to network in booting

- Autorun HMI program
	1. add **"sudo home/pi/mv-hmi-lakban/build/linux-armv7l-unpacked/mv-hmi-lakban-baru"** in **"/etc/profile"**
	2. To exit from HMI fullscreen mode, press : **CTRL+ALT+F1**
	3. To hide cursor : Find **"xserver-command = X"** in **"/etc/lightdm/lightdm.conf"** and add **"-nocursor"** to hide the cursor

- Note : to make this HMI, use electron with version >= 2.0.5

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
