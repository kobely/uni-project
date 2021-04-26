
const tabBar = {
    async setNavigationBarTitle(barTitle, currentRoute) {
        if (Object.keys(barTitle).length > 0) {
            for (let i = 0, len = barTitle.length; i < len; i++) {
                if(currentRoute.includes(barTitle[i].value)) {
                    uni.setNavigationBarTitle({
                        title: barTitle[i].new_name,
                    });
                    return barTitle[i].new_name;
                }
            }
        }
    }
};

export default tabBar;
