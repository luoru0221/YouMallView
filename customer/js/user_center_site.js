let vm = new Vue({
    el: '#app',
    data: {
        haveLogin: false,
        loginUser: {},

        cities: {},
        is_show_add: false,
        is_show_edit: false,

        my_address: [],
        default_address_id: 0,

        new_address: {
            receiveUserName: "",
            province: null,
            city: null,
            county: null,
            fullAddress: "",
            receiveUserPhone: "",
            receiveUserEmail: ""
        },
        edit_address: {
            addressId: 0,
            receiveUserName: "",
            province: "北京",
            city: "北京",
            county: "东城区",
            fullAddress: "",
            receiveUserPhone: "",
            receiveUserEmail: ""
        },

    },
    methods: {

        /**
         * 退出登录
         */
        logout: function () {
            this.haveLogin = false;
            this.loginUser = {};
            localStorage.removeItem("theLoginUser");
            sessionStorage.removeItem("theLoginUser");
        },

        /**
         * 添加新的收货地址
         */
        addAddress: function () {
            vm.$set(this.new_address, "userId", this.loginUser.userId);
            let that = this;
            console.log(that.new_address);
            axios.post('http://localhost:8080/YouMall/address/add.do', that.new_address)
                .then(function (response) {
                    that.is_show_add = false;
                    alert("添加成功！");
                    window.location.reload();
                })
                .catch(error => console.log(error));
        },

        /**
         * 编辑地址信息
         * @param index 需编辑的地址在my_address数组中的下标
         */
        editAddress: function (index) {
            //利用JSON复制对象，切断对象的引用
            this.edit_address = JSON.parse(JSON.stringify(this.my_address[index]));
            this.is_show_edit = true;
        },

        /**
         * 保存地址信息的修改
         */
        saveEdit: function () {
            if (this.edit_address.receiveUserName === "" || this.edit_address.fullAddress === "" || this.edit_address.receiveUserPhone === "") {
                alert("请将带*的数据项填写完整");
            } else {
                axios.post('http://localhost:8080/YouMall/address/save.do', this.edit_address)
                    .then(function (response) {
                        if (response.data === true) {
                            alert("修改成功!");
                            this.is_show_edit = false;
                            window.location.reload();
                        } else {
                            alert("系统异常，请稍后重试!");
                        }
                    })
                    .catch(error => console.log(error));
            }
        },

        /**
         * 删除地址
         * @param index 待删除的地址在my_address数组中的下标
         */
        deleteAddress: function (index) {
            let that = this;
            if (confirm('确定删除该地址？') === true) {
                let delete_cart = JSON.parse(JSON.stringify(that.my_address[index]));
                axios.post('http://localhost:8080/YouMall/address/delete.do', delete_cart)
                    .then(function (response) {
                        if (response.data === true) {
                            that.my_address.splice(index, 1);
                            alert("删除成功");
                        } else {
                            alert("系统异常，请稍后重试!");
                        }
                    })
                    .catch(error => console.log(error));
            }
        },

        /**
         * 修改默认地址
         * @param index 新的地址在my_address数组中的下标
         */
        changeDefault: function (index) {
            let that = this;
            let new_default = that.my_address[index].addressId;
            console.log(that.loginUser.userId);
            axios.get('http://localhost:8080/YouMall/address/changeDefault.do', {
                params: {
                    userId: that.loginUser.userId,
                    addressId: new_default
                }
            })
                .then(function (response) {
                    if (response.data === true) {
                        that.default_address_id = new_default;
                    } else {
                        alert("系统异常，请稍后重试!");
                    }
                })
                .catch(error => console.log(error));
        }


    },
    created() {
        let that = this;

        /**
         * 获取全国三级城市数据
         */
        axios.get("../json/city.json")
            .then(function (response) {
                that.cities = response.data;
                that.new_address.province = "北京";
                that.new_address.city = "北京";
                that.new_address.county = "东城区";
            })
            .catch(error => console.log(error));

        let localStatus = localStorage.getItem("theLoginUser");
        let sessionStatus = sessionStorage.getItem("theLoginUser");
        if (localStatus !== null) {
            this.loginUser = JSON.parse(localStatus);
            this.haveLogin = true;
        } else if (sessionStatus !== null) {
            this.loginUser = JSON.parse(sessionStatus);
            this.haveLogin = true;
        }

        axios.get('http://localhost:8080/YouMall/address/myAll.do', {
            params: {
                userId: that.loginUser.userId
            }
        }).then(function (response) {
            that.my_address = response.data;
        }).catch(error => console.log(error));

        axios.get('http://localhost:8080/YouMall/address/default.do', {
            params: {
                userId: that.loginUser.userId
            }
        }).then(function (response) {
            that.default_address_id = response.data;
        }).catch(error=>console.log(error));

    },

});
