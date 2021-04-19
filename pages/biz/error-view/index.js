export default {
    handleErrorButtonTap(e) {
        const { dataset } = e.currentTarget;
        if (dataset.href) {
            dd.redirectTo({url: dataset.href});
        } else {
            console.warn('no href specified,return back -1');
            //返回上一页
            dd.navigateBack({delta: 1});
        }
    }
}