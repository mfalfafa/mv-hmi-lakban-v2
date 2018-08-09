# mv-hmi-lakban-v2

> An electron-vue project

**mv-hmi-lakban-v2** is an HMI for Raspi 3 that is more reliable than v1 (**mv-hmi-lakban**).
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

> **Settings in Raspi 3**
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

> **How to use**
1. install **Raspbian Jessie**
2. **sudo raspi-config**
	- **Network options**
		- in **Wi-fi**, enter **SSID** and **Password**
	- **boot options**
		- in **Desktop/CLI**, select **Desktop autologin**
		- in **Wait for network**, select **No** in **Wait until a network connection is established**
		- in **Splash screen**, select **No** in showing splash screen
	- **interfacing options**
		- in **SSH**, select **yes** to enable SSH
	- Update Raspi 3 in **Update** menu
	- **Reboot** Raspi
3. Edit file **/etc/dhcpcd.conf** to make static IP for **eth0** interface
	```
	interface eth0
	static ip_address=192.168.10.xx/24	//xx : based on client configuration
	static routers=192.168.10.1
	```
4. Edit file **/etc/dhcp/dhclient.conf** to give timeout in booting time
	```
	uncomment timeout option and change the value :
	timeout=15;
	```
5. Install **git** in Raspi 3
	```
	sudo apt-get install git
	```
6. Install **Node JS**
	```
	sudo apt-get update
    sudo apt-get dist-upgrade
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
7. Clone **MV HMI Lakban**
	```
	git clone https://github.com/mfalfafa/mv-hmi-lakban-v2.git
	or
	git clone git://github.com/mfalfafa/mv-hmi-lakban-v2.git
	```
8. Edit file **/etc/profile** and add the following command
	```
	sudo /home/pi/mv-hmi-lakban-v2/build/linux-armv7l-unpacked/mv-hmi-lakban-baru
	```
9. Test that all settings are work by reboot
	```
	sudo reboot now
	```
10. If all settings are working (no error), disable **wlan0** to prevent IP conflict between **eth0** and **wlan0**. In file **/boot/config.txt** add the following command and reboot
	```
	dtoverlay=pi3-disable-wifi
	```
	So if you want to use SSH, then you must connect to Raspi 3 with LAN Port

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
