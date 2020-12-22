    /**
     * meuiBdmap 演示
     */

    /*+----------------------------------------+*/
    //=====默认地图
    //中国：不指定坐标和城市
    $('#test001').meuiBaiduMap('init', {
        width: 400, //地图高度,默认auto表示全屏(可选)
        height: 400, //地图宽度,默认auto表示全屏(可选)
        window:{ //窗口布局(可选)
            position: 'fixed' //定义方式(可选). 空或none 无任何定位(默认), fixed 绝对定位, absolute 相对定位
        }
    });

    //上海市：根据坐标定位
    $('#test002').meuiBaiduMap('init', {
        point: '121.522577,31.263404', //默认中心点经纬度坐标
        label: '上海市', //自定义标注点说明文字,默认空(可选). 当不空时,中心点标注文本为本参数,否则为城市名称
        zoom: 5, //地图缩放级别(值:3-19)
        width: 400,
        height: 400,
        window:{
            position: 'fixed'
        }
    });

    //武汉市：根据城市定位
    $('#test003').meuiBaiduMap('init', {
        city: '武汉市', //默认中心点城市
        isNumc: false, //地图中心点是根据城市还是坐标来设置. true 根据坐标(true), false 根据城市
        zoom: 5,
        width: 400,
        height: 400,
        window:{
            position: 'fixed'
        }
    });




    /*+----------------------------------------+*/
    //=====坐标拾取1（使用元素ClassName属性）
    $('.pick01').meuiBaiduMap('init', {
        label: '拖到合适位置放开',
        width: 400,
        height: 400,
        image: { //自定义坐标标注点图标及其它属性(可选)
            draged: true //图标是否可拖动,默认false(可选)
        },
        window:{
            position: 'absolute',
            pickup: true, //是否开启坐标拾取系统,默认false(可选)
            closed: true //是否显示关闭图标,默认false(可选)
        },
        openCityControl: false, //是否开启城市切换控件,默认true(可选)
        openMapTypeControl: false, //是否开启地图类型(即地图、卫星、混合)控件,默认true(可选)
        openCopyrightControl: false, //是否开启版本信息控件,默认true(可选)
        openOverViewControl: false //是否开启地图缩略图控件,默认true(可选)
    });




    /*+----------------------------------------+*/
    //=====坐标拾取2（使用元素ID属性）
    //泉州领袖天地
    $('#test101').meuiBaiduMap('init', {
        label: '拖到合适位置放开',
        width: 400,
        height: 400,
        image: {
            draged: true
        },
        window:{
            position: 'absolute',
            pickup: true,
            closed: true
        },
        openCityControl: false,
        openMapTypeControl: false,
        openCopyrightControl: false,
        openOverViewControl: false
    });

    //泉州浦西万达广场
    $('#test102').meuiBaiduMap('init', {
        label: '拖到合适位置放开',
        width: 400,
        height: 400,
        image: {
            draged: true
        },
        window:{
            position: 'absolute',
            pickup: true,
            closed: true
        },
        openCityControl: false,
        openMapTypeControl: false,
        openCopyrightControl: false,
        openOverViewControl: false
    });

    //泉州东海太禾广场
    $('#test103').meuiBaiduMap('init', {
        label: '拖到合适位置放开',
        width: 400,
        height: 400,
        image: {
            draged: true
        },
        window:{
            position: 'absolute',
            pickup: true,
            closed: true
        },
        openCityControl: false,
        openMapTypeControl: false,
        openCopyrightControl: false,
        openOverViewControl: false
    });




    /*+----------------------------------------+*/
    //=====坐标拾取3（按城市、区县定位）
    $('.pick03').meuiBaiduMap('init', {
        city: '$(this).siblings("span").text()', //参数值使用字符串表达式
        isNumc: false,
        label: '拖到合适位置放开',
        enableEval: true, //是否允许参数值使用字符串表达式,默认false(可选)
        width: 400,
        height: 400,
        image: {
            draged: true
        },
        window:{
            position: 'absolute',
            pickup: true,
            closed: true
        },
        openCityControl: false,
        openMapTypeControl: false,
        openCopyrightControl: false,
        openOverViewControl: false
    });




    /*+----------------------------------------+*/
    //=====坐标拾取4（按省、自治区、直辖市、特别行政区定位）
    $('.pick04').meuiBaiduMap('init', {
        city: '$(this).siblings("span").text()', //参数值使用字符串表达式
        isNumc: false,
        label: '拖到合适位置放开',
        enableEval: true, //是否允许参数值使用字符串表达式,默认false(可选)
        width: 400,
        height: 400,
        image: {
            draged: true
        },
        window:{
            position: 'absolute',
            pickup: true,
            closed: true
        },
        openCityControl: false,
        openMapTypeControl: false,
        openCopyrightControl: false,
        openOverViewControl: false
    });
    


    

    /*+----------------------------------------+*/
    //=====直接展示地图
    //默认地图
    $('#test201').meuiBaiduMap('init', {
        width: 400,
        height: 400,
        showMode: 'normal' //显示方式(可选). normal 固定显示,即在绑定节点上直接显示, click 点击显示(默认)
    });
    //自定义地图信息
    $('#test202').meuiBaiduMap('init', {
        width: 400,
        height: 400,
        showMode: 'normal',
        city: '泉州市',
        isNumc: false,
        zoom: 10, //地图缩放级别(值:3-19)
        copyright: 'XX版权所有，禁止侵权', //版权信息(可选)
        image: { //自定义坐标标注点图标及其它属性(可选)
            draged: false, //图标是否可拖动,默认false(可选)
            enable: true, //是否开启自定义图标, 默认false(可选)
            path: 'assets/img/', //图片文件夹相对静态文件html位置,仅当enable=true时有效(可选)
            icon: 'bmap_locate_green.png' //图标文件名,仅当enable=true时有效(可选)
        }
        //..
        //还有其它参数，不具体列出
    });