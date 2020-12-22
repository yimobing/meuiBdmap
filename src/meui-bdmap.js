/**
 * meuiBaiduMap
 * [MEUI百度地图插件]
 * Version：v1.0.0
 * Author: Mufeng
 * Date: 2020.12.03
 * Update: 2020.12.15
 */
(function ($) {


    /*------------------------------------------------------------------------------------------------
    *                                       通用方法库
    ------------------------------------------------------------------------------------------------*/
    var methods = {

        /**
         * 地图初始化
         * @param {object} options 参数
         */
        init:function(options){
            var _this = this; //对图生成的节点对象
            var defaults = {
                city: '中国', //默认中心点城市
                point: '116.592841,40.498135', //默认中心点经纬度坐标
                isNumc: true, //地图中心点是根据城市还是坐标来设置. true 根据坐标(true), false 根据城市
                label: '', //自定义标注点说明文字,默认空(可选). 当不空时,中心点标注文本为本参数,否则为城市名称
                zoom: 3, //地图缩放级别(值:3-19)
                copyright: 'MEUI百度地图插件', //版权信息(可选)
                
                //
                width: 'auto', //地图高度,默认auto表示全屏(可选)
                height: 'auto', //地图宽度,默认auto表示全屏(可选)
                image: { //自定义坐标标注点图标及其它属性(可选)
                    draged: false, //图标是否可拖动,默认false(可选)
                    enable: false, //是否开启自定义图标, 默认false(可选)
                    path: 'meui/img/', //图片文件夹相对静态文件html位置,仅当enable=true时有效(可选)
                    icon: 'bmap_locate_blue.png' //图标文件名,仅当enable=true时有效(可选)
                },

                //窗口布局及显示方式
                showMode: 'click', //显示方式(可选). normal 固定显示,即在绑定节点上直接显示, click 点击显示(默认)
                window:{ //窗口布局(可选)
                    position: 'none', //定义方式(可选). 空或none 无任何定位(默认), fixed 绝对定位, absolute 相对定位
                    pickup: false, //是否开启坐标拾取系统,默认false(可选)
                    closed: false //是否显示关闭图标,默认false(可选)
                },

                //
                enableEval: false, //是否允许参数值使用字符串表达式,默认false(可选)

                //控件
                openCityControl: true, //是否开启城市切换控件,默认true(可选)
                openMapTypeControl: true, //是否开启地图类型(即地图、卫星、混合)控件,默认true(可选)
                openCopyrightControl: true, //是否开启版本信息控件,默认true(可选)
                openOverViewControl: true, //是否开启地图缩略图控件,默认true(可选)

                //鼠标&视野
                enableScrollWheelZoom: true, //是否启用滚轮放大缩小,默认true(可选).(注：百度地图默认禁用)
                enableContinuousZoom: true, //是否启用地图惯性拖拽,默认true(可选).(注：百度地图默认禁用)
                enableDragging: true, //是否允许拖拽,默认true(可选).(注：百度地图默认允许)
                enableViewPort: false, //是否强制调整视野,即强制地图显示到某个视野,默认false(可选). 因centerAndZoom是异步,故要让使用setViewport起作用,必须设置本参数值为true.
                autoViewPort: true, //是否系统自动调整视野,默认true,仅当enableViewPort=true时有效(可选). 值：true 系统调用setViewport自动调整视野, false 前端手动调用setViewport调整视野(需设置延时,否则不起作用)

                //回调
                callBack: function(e){}, //回调：初始化地图后(可选). e参数格式 {"dom":"地图父节点", "map":"地图实例化对象Map", "zoom":"当前地图绽放级别"}
                mouseScroll: function(e){}, //回调：鼠标滚动地图时(可选). e参数格式 {"dom":"地图父节点", "map":"地图实例化对象Map", "zoom":"当前地图绽放级别"}
                mouseClick: function(e){}, //回调：鼠标点击地图时(可选). e参数格式 {"dom":"地图父节点", "map":"地图实例化对象Map", "zoom":"当前地图绽放级别", "point":{"lng":"经度", "lat":"纬度"}}
                mouseDoubleClick: function(e){}, //回调：鼠标双击地图时(可选). e参数格式 {"dom":"地图父节点", "map":"地图实例化对象Map", "zoom":"当前地图绽放级别", "point":{"lng":"经度", "lat":"纬度"}}
                mouseDrag: function(e){} //回调：鼠标拖拽地图时(可选). e参数格式 {"dom":"地图父节点", "map":"地图实例化对象Map", "zoom":"当前地图绽放级别", "point":{"lng":"经度", "lat":"纬度"}, "event":"拖拽事件名称"}, 其中 event值有3个：dragstart 拖拽开始, dragging 拖拽进行中, dragend 拖拽结束
            }
            var settings = $.extend(true, {}, defaults, options || {});
            
            var winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, //浏览器宽
                winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //浏览器高

            var dIsNumc = settings.isNumc,
                dCity = settings.city,
                dPoint = settings.point,
                dLabel = settings.label == '' ? dCity : settings.label,
                dZoom = settings.zoom,
                dCopyright = settings.copyright,
                dWidth = settings.width,
                dHeight = settings.height,
                dMode = settings.showMode,
                dWindow = settings.window,
                dImage = settings.image,
                dEnableEval = settings.enableEval,
                dOpenCityControl = settings.openCityControl,
                dOpenMapTypeControl = settings.openMapTypeControl,
                dOpenCopyrightControl = settings.openCopyrightControl,
                dOpenOverViewControl = settings.openOverViewControl,
                dEnableViewPort = settings.enableViewPort,
                dAutoViewPort = settings.autoViewPort;

            var dLongitude = dPoint.split(',')[0], //经度
                dLatitude = dPoint.split(',')[1]; //纬度
            var dWidth = parseFloat(dWidth != 'auto' ? dWidth.toString().replace(/px/g, '') : winW),
                dHeight = parseFloat(dHeight != 'auto' ? dHeight.toString().replace(/px/g, '') : winH);
            var dImgDraged = typeof dImage.draged == 'undefined' ? false : (dImage.draged === true ? true : false),
                dImgEnable = typeof dImage.enable == 'undefined' ? false : (dImage.enable === true ? true : false),
                dImgPath = dImage.path,
                dImgIcon = dImage.icon;
            var dPickup = dWindow.pickup,
                dPosition = dWindow.position,
                dClosed = dWindow.closed;
            
             //循环
             return this.each(function(u){
                var $this = $(this); //当前插件元素对象
                var eleClassName = '.bmap_ele_' + utilities.generateRandomChar();
                $this.addClass(eleClassName.toString().replace(/[\.\#]/g, ''));
                //console.log('循环次数：', (u+1), '\n$this:', $this); //testing
                var tagname = $this[0].tagName.toLocaleLowerCase();
                //创建地图
                if(dMode == 'click'){
                    if(typeof _this.selector != 'undefined'){
                        //写法1：不兼容动态元素
                        // $this.off('click').on('click', function(){
                        //     createBdmap();
                        // })
                        //写法2：兼容动态元素
                        $(document).off('click', eleClassName).on('click', eleClassName, function(){
                            if(dEnableEval){
                                //以下几个参数的值允许使用字符串表达式
                                try{
                                    dIsNumc = eval(settings.isNumc);
                                    dCity = eval(settings.city);
                                    dPoint = eval(settings.point);
                                    dLabel = eval(settings.label) == '' ? dCity : eval(settings.label);
                                }catch(exception){
                                    //console.warn('eval参数错误：', exception);
                                }
                            } 
                            createBdmap();
                        })
                    }
                }else{  
                    createBdmap();   
                }
                function createBdmap(){
                    var root_id = $.NODE.ROOTID + utilities.generateRandomChar(),
                        map_id = $.NODE.MAPID + utilities.generateRandomChar();
                    //=====创建地图外部HTML
                    /*要分种情况：
                        1.有绑定节点
                            ①.绑定的节点不存在 <=> 创建自定义的节点用于显示地图
                            ②.绑定的节点存在,但不存在ID属性 <=> 给该节点添加ID属性用于显示地图
                            ③.绑定的节点存在,也存在ID属性 <=> 直接在该节点上显示地图 
                        2.没绑定节点
                    */
                    //console.log('this:', _this, '\nselector', _this.selector, '\noptions:', options, '\nwidth:', dWidth, '\nheight:',dHeight)
                    var isBindNode = true; //是否有绑定节点
                    if(typeof _this.selector == 'undefined' || dMode == 'click' || (tagname == 'textarea' || tagname == 'input')) isBindNode = false;
                    var fatherClass = dPosition != 'none' ? ' ' + dPosition : '',
                        faterWidth = parseFloat(dWidth.toString().replace(/(px|%)/g, ''));
                    if(dPosition == 'fixed') faterWidth += 30;
                    var faterStyle = ' style="width:' + faterWidth + 'px;"';
                    var allHTML = [
                            '<div class="' + $.NODE.ROOTCLASS.toString().replace(/[\.\#]/g, '') + fatherClass + '" id="' + root_id.toString().replace(/[\.\#]/g, '') + '"' + faterStyle + '>',
                                '<div class="' + $.NODE.MAPCLASS.toString().replace(/[\.\#]/g, '') + '" id="' + map_id.toString().replace(/[\.\#]/g, '') + '"></div>',
                            '</div>'
                    ].join('\r\n');
                    if(isBindNode){ //有绑定节点
                        //console.log('a', '节点：', $this); //testing
                        if($this.length == 0){ //①.绑定的节点不存在
                            //console.log('b'); //testing
                            $('body').prepend(allHTML);
                            _this = $(map_id);
                        }else if(typeof $this.attr('id') == 'undefined'){ //②.绑定的节点存在,但不存在ID属性
                            //console.log('c'); //testing
                            $this.wrap(allHTML).prev().remove();
                            $this.attr('id', map_id.toString().replace(/[\.\#]/g, ''));
                            _this = $(map_id);
                        }else{ //③.绑定的节点存在,也存在ID属性
                            //console.log('d'); //testing
                            //$this.wrap(allHTML).prev().remove();
                            $this.append(allHTML).children().prev().remove();
                            _this = $(map_id);
                        }
                               
                    }else{ //没绑定节点
                        //console.log('e'); //testing
                        if($(map_id).length == 0){
                            $($.NODE.ROOTCLASS).each(function(){
                                if($(this).hasClass('fixed') || $(this).hasClass('absolute')) $(this).remove();
                            })
                            if(dPosition == 'absolute'){
                                $this.after(allHTML);
                            }else{
                                $('body').prepend(allHTML);
                                //$(root_id).siblings($.NODE.ROOTCLASS).remove();
                            }
                            _this = $(map_id);
                            //点击其它地方时关闭控件(Bug:当点地图上系统自带的标注点时会自动关闭控件,因为这些标注点的dom不在控件上)
                            $(document).on('click', function(e){
                                if($(e.target).closest(eleClassName).length == 0 && $(e.target).closest(root_id).length == 0)
                                $(root_id).remove();
                            })
                        }
                    }
                    
                    //设置地图宽度、高度(高度一定设置,不然在服务器环境如.net地图可能不显示)
                    _this.css({'width': dWidth, 'height': dHeight});
                   
                    //根节点
                    var $rootNode = $(root_id);
                    //创建地图内部HTML
                    var _sonEleClass = dWidth < winW ? '' : ' pass';
                    //创建关闭按钮
                    if(dClosed){
                        var closeHTML = [
                            '<div class="bdmap_close' + _sonEleClass + '">',
                            '</div>'
                        ].join('\r\n')
                        if($rootNode.find('.bdmap_close').length == 0) $rootNode.prepend(closeHTML);
                        $('.bdmap_close').on('click', function(){
                            $rootNode.remove();
                        })
                    }
                    //创建坐标拾取系统
                    if(dPickup){
                        var boxValue = tagname == 'input' || tagname == 'textarea' ? $this.val() : $this.text();
                        if(utilities.stringIsCoordinate(boxValue)){ //若字符串是坐标
                            dPoint = boxValue;
                            dIsNumc = true;
                        }
                        var pickupHTML = [
                            '<div class="bdmap_point' + _sonEleClass + '">',
                                '当前坐标点 <input type="text" id="bdmap_point_text">',
                                '<button type="button" id="bdmap_point_confirm">确定</button>',
                                '<button type="button" id="bdmap_point_copy">复制</button>',
                            '</div>'
                        ].join('\r\n');
                        if($rootNode.find('.bdmap_point').length == 0) $rootNode.prepend(pickupHTML);
                        $('#bdmap_point_confirm').on('click', function(){
                            $rootNode.remove();
                            var $text = $(this).siblings('#bdmap_point_text')
                            var value = $text.val();
                            tagname == 'input' || tagname == 'textarea' ? $this.val(value) : $this.text(value);
                        })
                        $('#bdmap_point_copy').on('click', function(){
                            var $text = $(this).siblings('#bdmap_point_text')
                            var value = $text.val();
                            $text[0].select();
                            document.execCommand("Copy"); // 执行浏览器复制命令
                            //alert("已复制好，可贴粘。");
                        })
                    }
                    

                    //=====
                    var selector = _this.attr('id');
                    if(typeof selector == 'undefined') {
                        console.log($.tooltip.noNodeTips)
                        return false;
                    }
                    var map = new BMap.Map(selector); //初始化地图对象. map 地图实例化对象Map

                    //=====回调函数参数
                    var params = {
                        "dom": _this, 
                        "map": map, 
                        "zoom": map.getZoom() //当前地图缩放级别
                    }

                    //=====全局对象赋值
                    $.MAPER = map;
                    $.ENABLEVIEWPORT = dEnableViewPort;
                    $.AUTOVIEWPORT = dAutoViewPort;
                    $.IMAGEDRAGED = dImgDraged;
                    $.IMAGEENABLE = dImgEnable;
                    $.IMAGEPATH = dImgPath;
                    $.IMAGEICON = dImgIcon;  
                    //=====设置中心点、设置默认城市(城市名称或坐标经纬度)
                    if(!dEnableViewPort || (dEnableViewPort && !dAutoViewPort)){ //当不强制调整视野时,则手动设置中心点
                        var point = new BMap.Point(dLongitude, dLatitude);
                        if(dIsNumc) map.centerAndZoom(point, dZoom); //用坐标设置地图中心站
                        else map.centerAndZoom(dCity, dZoom);  //用城市设置地图中心点
                    }
                    //=====设置默认中心点标注点
                    if(dPickup){ //当开启坐标拾取系统
                        var boxValue = tagname == 'input' || tagname == 'textarea' ? $this.val() : $this.text();
                        if(utilities.stringIsCoordinate(boxValue)){ //输入框值是坐标,则按坐标定位并强制调整视野
                            addCenterMarker(dPoint, dLabel, true);
                        }else{ //输入框值非坐标
                            if(!dIsNumc){ //按城市定位
                                var geoc = new BMap.Geocoder();
                                var capital = utilities.getProvinceCatital(dCity); //省会城市
                                var ls_city = capital == '' ? dCity : capital;
                                geoc.getPoint(ls_city, function(e){
                                    if(e != null){
                                        addCenterMarker(e.lng + ',' + e.lat, dLabel, false);
                                        map.centerAndZoom(ls_city, capital == '' ? 12 : 7); //省时缩放级别为7，城市时绽放级别为12
                                        if(settings.callBack){ //初始化回调
                                            settings.callBack(params);
                                        }
                                    }
                                })
                            }else{ //按坐标定位
                                addCenterMarker(dPoint, dLabel, false);
                                if(settings.callBack){ //初始化回调
                                    settings.callBack(params);
                                }
                            }
                        }     
                    }else{
                        if(!dIsNumc){ //按城市定位
                            var geoc = new BMap.Geocoder();
                            geoc.getPoint(dCity, function(e){
                                if(e != null){
                                    addCenterMarker(e.lng + ',' + e.lat, dLabel, dEnableViewPort);
                                    if(settings.callBack){ //初始化回调
                                        settings.callBack(params);
                                    }
                                }
                            })
                        }else{ //按坐标定位
                            addCenterMarker(dPoint, dLabel, dEnableViewPort);
                            if(settings.callBack){ //初始化回调
                                settings.callBack(params);
                            }
                        }
                    }
                    
                    //=====启用XX
                    if(settings.enableScrollWheelZoom) map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                    if(settings.enableContinuousZoom) map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                    if(settings.enableDragging) map.enableDragging(); //是否允许拖拽
                    else map.disableDragging();

                    //=====添加地图控件
                    //城市切换控件
                    if(dOpenCityControl){
                        map.enableContinuousZoom();
                        map.addControl(new BMap.CityListControl({
                            anchor: BMAP_ANCHOR_TOP_RIGHT,
                            offset: new BMap.Size(20, 10),
                            // 切换城市之间事件
                            // onChangeBefore: function(){
                            //    alert('before');
                            // },
                            // 切换城市之后事件
                            // onChangeAfter:function(){
                            //   alert('after');
                            // }
                        }))
                    }
                    //地图类型控件
                    if(dOpenMapTypeControl){
                        var mapType1 = new BMap.MapTypeControl({
                            mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP], //分别为：普通街道视图、卫星视图、卫星和路网的混合视图
                            anchor: BMAP_ANCHOR_TOP_RIGHT, 
                            offset: new BMap.Size(20, 50)
                        })
                        map.addControl(mapType1);
                        // //地图、卫星、三维（相当于地图、混合、三维)
                        // var mapType2 = new BMap.MapTypeControl({
                        //     anchor: BMAP_ANCHOR_TOP_RIGHT,
                        //     offset: new BMap.Size(10, 50)
                        // });
                        // map.addControl(mapType2);
                        // map.setCurrentCity(dCity); //由于有3D图，需要设置城市哦
                    }
                    //第3方版权信息
                    if(dOpenCopyrightControl){
                        var cr = new BMap.CopyrightControl(
                            {
                                anchor: BMAP_ANCHOR_TOP_RIGHT,
                                offset: new BMap.Size(100, 10)
                            } //设置版权控件位置
                        )
                        map.addControl(cr); //添加版权控件
                        var bs = map.getBounds();   //返回地图可视区域
                        cr.addCopyright({id: 1, content: '<a class="b_copyright">' + dCopyright + '</a>', bounds: bs}); 
                    }
                    //缩略地图控件
                    if(dOpenOverViewControl){
                        var overViewOpen = new BMap.OverviewMapControl({
                            isOpen: true, 
                            anchor: BMAP_ANCHOR_BOTTOM_RIGHT
                        });
                        map.addControl(overViewOpen);
                    }

                    //=====回调函数
                    // //初始化回调
                    // if(settings.callBack){
                    //     settings.callBack(params);
                    // }
                    //鼠标滚动
                    if(settings.mouseScroll){
                        /**监听鼠标滚动事件
                        * 火狐：DOMMouseScroll;
                        * IE/Opera/Chrome：直接添加事件
                        */
                        var scrollFunc = function(e){
                            e = e || window.event;
                            if(e.wheelDelta){ //IE/Opera/Chrome
                                mouseScrollEvent();
                            }else if(e.detail){ //Firefox
                                mouseScrollEvent();
                            }
                        }
                        if(document.addEventListener){ //W3C
                            document.addEventListener('DOMMouseScroll', scrollFunc, false);
                        }
                        window.onmousewheel = document.onmousewheel = scrollFunc; //IE/Opera/Chrome
                        //地图放大缩小事件(鼠标滚动)
                        var mouseScrollEvent = function () {
                            params["zoom"] = map.getZoom();
                            settings.mouseScroll(params);
                        }
                    }
                    //鼠标单击
                    if(settings.mouseClick){
                        map.addEventListener('click', function(e){
                            //console.log('当前e:', e)
                            params["zoom"] = map.getZoom();
                            var longitude = e.point.lng,
                                latitude = e.point.lat;        
                            var nowParams = params;
                            nowParams["point"] = {"lng": longitude, "lat": latitude}
                            settings.mouseClick(nowParams);
                            if(dPickup){ //当开启坐标拾取系统
                                addCenterMarker(longitude + ',' + latitude, dLabel, false); //重置中心点标注
                            }
                        })
                    }
                    //鼠标双击
                    if(settings.mouseDoubleClick){
                        map.addEventListener('dblclick', function(e){
                            //console.log('当前e:', e)
                            params["zoom"] = map.getZoom();
                            var lng = e.point.lng, lat = e.point.lat;
                            var nowParams = params;
                            nowParams["point"] = {"lng": lng, "lat": lat}
                            settings.mouseDoubleClick(nowParams);
                        })
                    }
                    //鼠标拖拽
                    if(settings.mouseDrag){
                        //map.addEventListener('拖拽事件名称', function(e){ }); //拖拽操作. 其中：“拖拽事件名称”有3个：dragstart 拖拽开始, dragging 拖拽过程, dragend 拖拽结束
                        //合起来写成如下:
                        ['dragstart','dragging','dragend'].forEach(function(item, index){
                            // console.log('item:', item, ' index:', index);
                            map.addEventListener(item, function(e){
                                // if(item == 'dragstart'){
                                //     console.log('拖拽开始')
                                // }
                                // if(item == 'dragging'){
                                //     console.log('拖拽进行中')
                                // }
                                // if(item == 'dragend'){
                                //     console.log('拖拽结束')
                                // }
                                params["zoom"] = map.getZoom();
                                var lng = e.point.lng, lat = e.point.lat;
                                var nowParams = params;
                                nowParams["point"] = {"lng": lng, "lat": lat}
                                nowParams["event"] = item;
                                settings.mouseDrag(nowParams);
                                
                                if(item == 'dragend'){
                                    if(dPickup){ //当开启坐标拾取系统
                                        addCenterMarker(lng + ',' + lat, dLabel, false); //重置中心点标注
                                    }
                                }
                            })
                        })
                    }
                }
            })
        }, 


        

        /**
         * 创建坐标系统/创建标注点
         * @param {object} pointJson 坐标数据
         * @param {object} paramJson 其它数据
         */
        createMapPoint:function(pointJson, paramJson){
            if(typeof pointJson.data == 'undefined') return;
            var _this = this;
            var map = $.MAPER; //map 地图实例化对象Map
            if(map == null){
                console.log($.tooltip.noMapTips);
                return;
            }
            map.clearOverlays();  //一次移除所有的覆盖物(相当于清空所有标注点)(必须!)
            //map.removeOverlay(overlay:  Overlay); //移除指定覆盖物
            var pointArray = []; //所有坐标点组所的数组
            $.each(pointJson.data, function(i, item){
                //默认
                var defaultsData = {}
                var defaultValue = { //单条数据源默认值
                    coordinates: '',
                    id: '',
                    title: '',
                    description: '',
                    dragging: true,
                    isInfo: true,
                    theme: 'blue',
                    icon: ''
                }
                var defaultsOther = {
                    format: { //自定义数据源字段名称(可选). 方便后台传输任意的字段名,前端只需自定义一下即可
                        //字段名称格式: 
                        //除了经纬度坐标字段外只能用格式： '["字段"]' 来表示外，其它皆可用格式：'A["字段1"]B["字段2"]C'
                        //其中： A、B、C表示任意字符, 里面可含HTML代码. eg. coordinates:'<div>地区名：["title"] <br>楼盘数量：["lpsl"]个</div>'}
                        coordinates: '["coordinates"]', //经纬度坐标
                        title: '["title"]', //文字标题,标注点文字
                        id: '["id"]', //记录主键key(可选)
                        description: '["description"]', //描述,信息窗文字(可选)
                        dragging: '["dragging"]', //标注点是否可拖拽,默认false(可选)
                        isInfo: '["isInfo"]', //标注点是否有信息窗,默认true(可选)
                        theme: '["theme"]', //标注点主题(可选). blue 蓝色(默认), white 白色, red 红色, green 绿色, orange 橙色
                        icon: '["icon"]' //标注点图标(可选)
                    },
                    style: { //标注点默认样式(可选)
                        color: "#333",
                        backgroundColor: "#fff",
                        fontSize: "12px",
                        //height : "20px",
                        //lineHeight : "20px",
                        padding: "5px 8px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "#1296db",
                        borderRadius: "3px",
                        fontFamily: "微软雅黑"
                    },
                    dbClickMarkerAutoScale: false, //是否开启双击标注点图标后地图缩放级别自动放大一级,默认false(可选).
                    labelEnable: true, //是否开启标注点文字,默认true(可选).
                    infoEnable: true, //是否开启信息窗,默认true(可选). 优先权大于单条数据里的isInfo字段
                    infoOpenMethod: 'mouseover', //信息窗打开方式(可选). mouseover 鼠标经过标注点时(默认)，click 点击标注点时
                    showDetails: false, //标注点是否默认就显示详细信息,默认false(可选)
                    //回调
                    markerClickBack: null, //点击标注点图标后会触发此事件(可选). e参数：{point:{lng:"经度", lat:"纬度"}, id:"记录主键值"}
                    markerDoubleClickBack: null, //双击标注点图标后会触发此事件(可选). e参数：{dom:"地图父节点", map:"地图实例化对象Map", zoom:"当前地图绽放级别", point:{lng:"经度", lat:"纬度"}, id:"记录主键值"}
                    labelClickBack: null, //点击标注点文字后会触发此事件(可选). 回调e参数：{point:{lng:"经度", lat:"纬度"}, id:"记录主键值"}
                    infoEventsFunc: null //点标注点信息窗内部DOM系列事件(可选). e参数：{point:{lng:"经度", lat:"纬度"}, id:"记录主键值"}
                }

                var datasource = $.extend(true, {}, defaultValue, item || {});
                var others = $.extend(true, {}, defaultsOther, paramJson || {});

                //格式重置
                var style = others.style;
                var format = others.format;
                for(var v in format){
                    defaultsData[v] = {};
                    //console.log('format[v]:', format[v]);
                    defaultsData[v]["field"] = format[v];
                    defaultsData[v]["value"] = defaultValue[v];  
                }
                //console.log('defaultsData:', defaultsData);
                //取值1
                var coordinates = defaultsData.coordinates.field,
                    id = defaultsData.id.field,
                    title = defaultsData.title.field,
                    description = defaultsData.description.field,
                    dragging = defaultsData.dragging.field, 
                    isInfo = defaultsData.isInfo.field,
                    theme = defaultsData.theme.field, 
                    icon = defaultsData.icon.field;
                //将字段名称转化成实际值
                coordinates = utilities.getAnalysisString(coordinates, datasource);
                id = utilities.getAnalysisString(id, datasource);
                title = utilities.getAnalysisString(title, datasource);
                description = utilities.getAnalysisString(description, datasource);
                dragging = utilities.getAnalysisString(dragging, datasource) === 'true' ? true : false;
                isInfo = utilities.getAnalysisString(isInfo, datasource) === 'false' ? false : true;
                theme = utilities.getAnalysisString(theme, datasource);
                icon = utilities.getAnalysisString(icon, datasource);
                var zwArr = coordinates.split(','),
                    longitude = zwArr.length > 0 ? zwArr[0] : '', //经度
                    latitude = zwArr.length > 1 ? zwArr[1] : ''; //纬度
                pointArray.push(new BMap.Point(longitude, latitude)); //push到数组中
                //取值2
                var dbClickMarkerAutoScale = others.dbClickMarkerAutoScale,
                    labelEnable = others.labelEnable,
                    labelClickBack = others.labelClickBack,
                    infoEnable = others.infoEnable,
                    infoOpenMethod = others.infoOpenMethod,
                    showDetails = others.showDetails;
                if(showDetails){
                    title = description;
                    isInfo = false;
                }
                var infoEventsFunc = others.infoEventsFunc,
                    markerClickBack = others.markerClickBack,
                    markerDoubleClickBack = others.markerDoubleClickBack;
                //创建标注点
                var point = new BMap.Point(longitude, latitude); //创建坐标
                //自定义坐标图标
                icon = $.IMAGEENABLE ? ( icon == '' ? ($.IMAGEPATH + $.IMAGEICON) : $.IMAGEPATH + icon) : '';
                var $iconJson = {}
                if(icon != ''){
                    var size = new BMap.Size(30,30); //自定义的图标大小
                    var iconOptions = {
                        //offset: new BMap.Size(0, 0),
                        //imageOffset: new BMap.Size(0, 0),
                        anchor: new BMap.Size(5, 10) //图标的定位锚点。此点用来决定图标与地理位置的关系，是相对于图标左上角的偏移值，默认等于图标宽度和高度的中间值
                    }
                    var icon = new BMap.Icon(icon, size,iconOptions);
                    $iconJson = {"icon":icon}
                }
                //添加marker覆盖物
                var marker = new BMap.Marker(point, $iconJson); //创建标注
                marker.dataId = id == 'undefined' ? '' : id; //设置marker自定义属性dataId
                marker.dataLng = longitude; //设置marker自定义属性dataLng(经度)
                marker.dataLat = latitude; //设置marker自定义属性dataLat(纬度)
                map.addOverlay(marker); //将标注添加到地图中
                //标注点是否可拖拽
                dragging = $.IMAGEDRAGED ? dragging : false;
                if(dragging) marker.enableDragging(); //可以拖拽
                else marker.disableDragging(); //不允许拖拽
                //拖拽标注图标后会触发此事件
                marker.addEventListener('dragend', function(e){
                    var x = e.point.lng,
                        y = e.point.lat;
                    var ele = $('#bdmap_point_text');
                    if(ele.length != 0){
                        ele.val(x + ',' + y);
                    }
                })      
                //点击标注图标后会触发此事件
                marker.addEventListener('click', function(e){
                    if(markerClickBack != null && typeof markerClickBack === 'function'){
                        //获取marker自定义属性
                        var _id = typeof marker.dataId == 'undefined' ? '' : marker.dataId,
                            _lng = typeof marker.dataLng == 'undefined' ? '' : marker.dataLng,
                            _lat = typeof marker.dataLat == 'undefined' ? '' : marker.dataLat;
                        markerClickBack({"point":{"lng":_lng, "lat":_lat}, "id": _id});
                    }
                })
                //双击标注图标后会触发此事件
                marker.addEventListener('dblclick', function(e){
                    var zoom = -1;
                    if(dbClickMarkerAutoScale){
                        zoom = map.getZoom();
                        zoom++; //每次双击放大一级
                        if(zoom <= 19) map.setZoom(zoom);
                    }
                    if(markerDoubleClickBack != null && typeof markerDoubleClickBack === 'function') {
                        if(zoom == -1) zoom = map.getZoom();
                        // var positions = marker.getPosition(),
                        //     _lng = positions.lng,
                        //     _lat = positions.lat;
                        //获取marker自定义属性
                        var _id = typeof marker.dataId == 'undefined' ? '' : marker.dataId,
                            _lng = typeof marker.dataLng == 'undefined' ? '' : marker.dataLng,
                            _lat = typeof marker.dataLat == 'undefined' ? '' : marker.dataLat;
                        var e = {"dom":_this, "map":map, "zoom":zoom, "point":{"lng":_lng, "lat":_lat}, "id":_id};
                        markerDoubleClickBack(e);
                    }
                })               
                //其它
                //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //标注点使用跳动的动画
                //marker.disableMassClear(); //禁止覆盖物在 map.clearOverlays 方法中被清除 //enableMassClear(); //允许清除
                //设置标注点文字标签
                if(labelEnable){
                    var $dataJson = {
                        "point":point, 
                        "title":title, 
                        "theme":theme, 
                        "style": style, 
                        "showDetails": showDetails,
                        "labelClickBack": labelClickBack
                    }
                    addMarkerLabel(marker, $dataJson);
                }
                //设置标注点信息窗
                if(infoEnable){
                    if(isInfo){
                        var $infoJson = {
                            "point": point,
                            "title": title,
                            "description": description,
                            "infoOpenMethod": infoOpenMethod,
                            "infoEventsFunc": infoEventsFunc
                        }
                        addMarkerInfoWindow(marker, $infoJson);
                    }
                }
            })

            if($.ENABLEVIEWPORT && $.AUTOVIEWPORT){
                map.setViewport(pointArray);
            }
        },





        /**
         * 创建行政区域边界
         * @param {object} ps_source 行政区域数据
         * @param {object} ps_opts 其它参数(可选)
         */

        /*
         * -----------------------
            ps_source参数格式：
         * -----------------------
            {
                source: {data:[{mc:"福建省", "zuobiao":"经度,纬度", "lpsl":"30"}, {mc:"浙江省", "zuobiao":"经度,纬度", "lpsl":"50"}]},
                format: {title: '["mc"]', description:'<div>楼盘数量：["lpsl"]个</div>'} //
            }
            其中: 
            · source 数据源,里面的字段可随意; 
            · format 数据源字段. 
                    title 标注点标题, 值用 '["行政区域字段名"]' 的格式表示. eg. {title:'["mc"]'}
                    description 标注点描述(可选). 值用 'A["字段1"]B["字段2"]C 的格式表示(A、B、C表示任意字符), 里面可含HTML代码. eg. {description:'<div>地区名：["mc"] <br>楼盘数量：["lpsl"]个</div>'}

         * -----------------------
            ps_opts参数格式：
         * -----------------------
            {
                enableLabel: true, //是否创建文本标注,true是(默认), false 否
                offset: [-40, -25], //位置偏移值. [X方向偏移量, Y方向偏移量]
                style: { //css样式(可选)
                    //采用驼峰写法.eg.
                    //height: "20px",
                    //lineHeight: "20px",
                    fontSize: "14px",  //文字大小
                    fontFamily: "微软雅黑",
                    color: "#1296db", //文字颜色
                    backgroundColor: "#fff", //背景色
                    padding: "5px 8px", //内部距离
                    borderWidth: "1px", //边框宽 
                    borderStyle: "solid", //边框样式
                    borderColor: "#0ce", //边框颜色
                    borderRadius: "3px", //边框圆角
                    zIndex: 99 //层级
                }
            }
         * -----------------------*/
        createMapBoundary:function(ps_source, ps_opts){
            var colors = ["#fff492", "#98d057", "#e19ee6", "#1ad3da", "#ffc11d", "#98e800", "#b95817", "#03a9f4", "#39d0a4", "#8bbb53"]; //背景色
            if(typeof ps_source.source == 'undefined') return;
            if(typeof ps_source.format == 'undefined') return;
            var source = ps_source.source;
            var format = ps_source.format;
            var title = typeof format.title == 'undefined' ? '' : format.title,
                description = typeof format.description == 'undefined' ? '' : format.description,
                tField = title.match(/\[\"(.*?)\"\]/g),
                dField = description.match(/\[\"(.*?)\"\]/g);
            //console.log('标题：',title, '\n标题字段数组：',tField, '\n描述：',description, '\n描述字段数组：',dField); 
            if(title === ''){
                alert('行政区域字段为空，请设置format参数\n格式: format:{title:\'["行政区域英文字段"]\', description:\'描述\'}');
                return;
            }
            if(typeof source.data == 'undefined') return;
            if(source.data.length != 0){
                methods.clearOverlays(); //清除所有覆盖物
            }

            for(var m = 0; m < source.data.length; m++){
                var row = source.data[m];
                //console.log('row：', row)
                var newTitle = title;
                if(tField != null){
                    for(var k = 0; k < tField.length; k++){
                        var origins = tField[k];
                        var fields = origins.replace(/(.*?)\[\"(.*?)\"\](.*)/g, '$2'); //提取字段名,即提取[a]中的a
                        newTitle = newTitle.replace(origins, row[fields]);
                    }
                } 
                var newDescription = description;
                if(description !== '' && dField != null){
                    for(var k = 0; k < dField.length; k++){
                        var origins = dField[k];
                        var fields = origins.replace(/(.*?)\[\"(.*?)\"\](.*)/g, '$2'); //提取字段名,即提取[a]中的a
                        newDescription = newDescription.replace(origins, row[fields]);
                    }
                }
                //console.log('循环m：', (m+1), '\n标题：', newTitle, '\n描述：',newDescription);
                var bgColor = m > (colors.length - 1) ? colors[0] : colors[m];
                createOneBoundary(newTitle, newDescription, bgColor, ps_opts);
            }

        },



        //==============================
        /**
         * 获取当前地图绽放级别
         * @returns {number} 返回当前缩放级别
         */
        getZoom:function(){
            var map = $.MAPER; //map 地图实例化对象Map
            if(map == null){
                console.log($.tooltip.noMapTips);
                return;
            }
            return map.getZoom();
        },

        /**
         * 获取地图当前中心点
         * @returns {point} 返回中心点坐标
         */
        getCenter:function(){
            var map = $.MAPER; //map 地图实例化对象Map
            if(map == null){
                console.log($.tooltip.noMapTips);
                return;
            }
            return map.getCenter();
        },


        /**
         * 移除所有地图覆盖物、清空所有标注点
         */
        clearOverlays:function(){
            var map = $.MAPER; //map 地图实例化对象Map
            if(map == null){
                console.log($.tooltip.noMapTips);
                return;
            }
            map.clearOverlays();
        },

        /**
         * 移除地图指定覆盖物
         * @param {overlay} overlay 地图覆盖物实例化对象
         */
        removeOverlay:function(overlay){
            var map = $.MAPER; //map 地图实例化对象Map
            if(map == null){
                console.log($.tooltip.noMapTips);
                return;
            }
            map.removeOverlay(overlay);
        }



    } //END methods







    /*------------------------------------------------------------------------------------------------
    *                                       函数库
    ------------------------------------------------------------------------------------------------*/
    /*
    function addMarker(point,label){
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
        marker.setLabel(label);
    },
    */


    /**
     * 添加中心点标注
     * @param {string} ps_point 经纬度坐标. 格式：'经度,纬度'
     * @param {string} ps_text 文字说明
     * @param {boolean} ps_viewport 是否强制调整视野,默认false(可选)
     */
    function addCenterMarker(ps_point, ps_text, ps_viewport){
        var isViewport = typeof ps_viewport == 'undefined' ? false : (ps_viewport === true ? true : false);
        $.ENABLEVIEWPORT = isViewport; //全局对象赋值
        methods.createMapPoint(
            {data:[{"coordinates":ps_point, "title":ps_text}]},
            {"infoEnable": false}
        );
        if($('#bdmap_point_text').length != 0) $('#bdmap_point_text').val(ps_point);
    }


    /**
    * 为标注点添加文本信息（标注点旁边文本）
    * @param {object} marker 地图实例化对象Marker
    * @param {object} dataJson 标记点文字标签信息
    */
    function addMarkerLabel(marker, dataJson){
        var defaultsData = {
            point: {}, //地图实例化对象Point
            title: '', //文字,标题
            theme: '', //标注点样式. 使用英文颜色(eg.red,green,orange) 或 颜色值 (eg.'#1296db')
            showDetails: true //标注点是否默认就显示详细信息
        }
        var texts = $.extend(true, {}, defaultsData, dataJson || {});
        var point = texts.point,
            title = texts.title,
            theme = texts.theme,
            style = texts.style,
            showDetails = texts.showDetails,
            labelClickBack = texts.labelClickBack;

        if(title === '') return;
        // var color = '#fff',
        //     backgroundColor = style==''? 'red' : style,
        //     borderColor = style =='' ? 'red' : 'transparent';
        //标签样式
        var lbStyleJson =  {
            color : "inherit",
            backgroundColor:"red",
            fontSize : "12px",
            //height : "20px",
            //lineHeight : "20px",
            padding:"5px 8px",
            borderWidth:"1px",
            borderStyle:"solid",
            borderColor:"red",
            borderRadius:"3px",
            fontFamily:"微软雅黑"
        }
        //文字样式
        var tempStr = '';
        for(var v in style){
            var attr = utilities.toLowerLine(v);
            var value = style[v];
            tempStr += attr + ':' + value + ';'; //eg. 'background-color:red;'
        }
        var txtStyleStr = tempStr == '' ? '' : 'style="' + tempStr + '"';
        //console.log('txtStyle:', txtStyleStr)
        //创建文本标注对象
        var label = new BMap.Label(
            '<div class="bdLabel ' + theme + '"' + txtStyleStr + '>'+ title +'</div>', 
            { //文字标签定位
                position: point, //指定文本标注所在的地理位置
                offset: new BMap.Size(25, -25) //设置文本偏移量x,y轴
            }
        ); 
        label.setStyle(lbStyleJson);
        //map.addOverlay(label); 
        marker.setLabel(label);

        //点击文本标注后会触发此事件
        label.addEventListener('click', function(e){
            if(labelClickBack != null && typeof labelClickBack === 'function') {
                //获取marker自定义属性
                var _id = typeof marker.dataId == 'undefined' ? '' : marker.dataId;
                    _lng = typeof marker.dataLng == 'undefined' ? '' : marker.dataLng,
                    _lat = typeof marker.dataLat == 'undefined' ? '' : marker.dataLat;
                labelClickBack({"point":{"lng":_lng, "lat":_lat}, "id": _id}); 
            }
        })
        
        setTimeout(function(){
            var $parent = $('.bdLabel').parent(); //$('.bdLabel').parents('.BMapLabel');
            var detailClassName = 'hasDetail';
            $parent.addClass('bdMarkerLabel');
            if(showDetails) $parent.addClass(detailClassName);
            else $parent.removeClass(detailClassName);
        }, 0)
       
    }




    /**
     * 为标注点添加信息窗
     * @param {object} marker 地图实例化对象Marker
     * @param {object} dataJson 信息窗数据
     */
    function addMarkerInfoWindow(marker, dataJson){
        var map = $.MAPER; //map 地图实例化对象Map
        if(map == null){
            console.log($.tooltip.noMapTips);
            return;
        }
        var defaultsData = {
            point: '', //坐标
            title: '', //标题
            description: '', //描述
            infoOpenMethod: 'mouseover', //信息窗打开方式. mouseover 鼠标经过标注点时，click 点击标注点时
            infoEventsFunc: null //信息窗内部DOM操作系列事件(可选)
        }
        var messages = $.extend(true, {}, defaultsData, dataJson || {});
        var title = messages.title,
            description = messages.description,
            point = messages.point,
            infoOpenMethod = messages.infoOpenMethod,
            infoEventsFunc = messages.infoEventsFunc;
        //创建信息窗口对象
        var infoWindow = new BMap.InfoWindow(
            '<div class="bdInfoWindow">'+description+'</div>',
            {
                //enableAutoPan:true, //是否开启信息窗口打开时地图自动移动（默认开启）
                width: 0,     //宽度(220-730) 0 自动调整
                maxWidth:500,  //最大宽度(220-730)
                height: 0,     //高度(60-650) 0 自动调整
                offset: { //位置偏移
                    width:15, 
                    height: -10
                },
                title: "" //title //文字,标题（支持HTML内容）
            }
        );
       
        //打开信息窗
        if(infoOpenMethod == 'click'){
            //鼠标点击标注点时弹出信息窗
            marker.addEventListener("click", 
                function(){
                    this.openInfoWindow(infoWindow);
                }
            );
        }else{
            //鼠标移动到标注点时弹出信息窗
            marker.addEventListener("mouseover", function(e){  //mouseover鼠标经过时,click鼠标点击时
                //var p = e.target.getPosition();
                //alert("标注点的位置是" + p.lng + "," + p.lat); 
                //var point = new BMap.Point(p.lng, p.lat);  //标注点坐标
                map.openInfoWindow(infoWindow, point); //开启信息窗口
            });
        }


        //信息窗自定义按钮系列事件（点击信息窗口里的按钮） add 20191115-1
        if(!infoWindow.isOpen()){ //isOpen()返回信息窗口的打开状态，第1次点击时是false,其它时间都是true
            infoWindow.addEventListener('open', function(e){
                if(infoEventsFunc != null && typeof infoEventsFunc === 'function') {
                    //获取marker自定义属性
                    var _id = typeof marker.dataId == 'undefined' ? '' : marker.dataId,
                        _lng = typeof marker.dataLng == 'undefined' ? '' : marker.dataLng,
                        _lat = typeof marker.dataLat == 'undefined' ? '' : marker.dataLat;
                    infoEventsFunc({"point":{"lng":_lng, "lat":_lat}, "id": _id});
                }
            });             
        }else{
            if(infoEventsFunc != null && typeof infoEventsFunc === 'function') {
                //获取marker自定义属性
                var _id = typeof marker.dataId == 'undefined' ? '' : marker.dataId,
                    _lng = typeof marker.dataLng == 'undefined' ? '' : marker.dataLng,
                    _lat = typeof marker.dataLat == 'undefined' ? '' : marker.dataLat;
                infoEventsFunc({"point":{"lng":_lng, "lat":_lat}, "id": _id});
            }
        }
    }



    
    /**
     * 为地图添加文本标注
     * @poram {string} ps_title 文本标题
     * @poram {string} ps_describe 文本描述
     * @param {point} ps_point 地理位置坐标. eg new BMap.Point(121.716076, 23.703799)
     * @param {string} ps_opts 其它参数(可选)
     * @returns {object} 返回Label实例化对象
     */
    function addMapLabel(ps_title, ps_describe, ps_point, ps_opts){
        var map = $.MAPER; //map 地图实例化对象Map
        if(map == null){
            console.log($.tooltip.noMapTips);
            return;
        }
        var defaults = {
            enableLabel: true, //是否创建文本标注,true是, false 否
            offset: [-40, -25], //位置偏移值. [X方向偏移量, Y方向偏移量]
            style: { //css样式(可选)
                //采用驼峰写法.eg.
                //height: "20px",
                //lineHeight: "20px",
                fontSize: "14px",  //文字大小
                fontFamily: "微软雅黑",
                color: "#1296db", //文字颜色
                backgroundColor: "#fff", //背景色
                padding: "5px 8px", //内部距离
                borderWidth: "1px", //边框宽 
                borderStyle: "solid", //边框样式
                borderColor: "#0ce", //边框颜色
                borderRadius: "3px", //边框圆角
                zIndex: 99 //层级
            }
        }
        var settings = $.extend({}, defaults || {}, ps_opts, true);
        var offset = settings.offset,
            x = offset[0],
            y = offset[1],
            style = settings.style;
        if(!settings.enableLabel) return null;
        var label = new BMap.Label(
            ps_title + ps_describe, 
            { 
                offset: new BMap.Size(x, y), //位置偏移值
                position: ps_point, //地理位置坐标
                enableMassClear: true //是否在调用clearOverlays时清除此覆盖物,默认true
            }
        );
        label.setStyle(style); //文本样式
        label.name = ps_title + '文本标注'; //自定义覆盖物标识name属性
        map.addOverlay(label); //添加文本覆盖物
        return label;
    }
    


    /**
     * 创建单个行政区域边界
     * @param {string} ps_area 行政区域名称(如：省份、城市、区县名称)
     * @param {string} ps_describe 行政区域描述(如其它一些补充信息等)
     * @param {string} ps_bg_color 区域形背景色
     * @param {string} ps_opts 其它参数(可选)
     */
    var viewArray = []; //多边形视野数组
    function createOneBoundary(ps_area, ps_describe, ps_bg_color, ps_opts){
        var map = $.MAPER; //map 地图实例化对象Map
        if(map == null){
            console.log($.tooltip.noMapTips);
            return;
        }
        var areaName = ps_area,
            areaDesc = ps_describe,
            bgColor = ps_bg_color;
        var bdary = new BMap.Boundary();
        bdary.get(areaName, function (rs) {       //获取行政区域
            //console.log('\n--------分隔线--------\n');
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                console.log('错误！未能获取当前输入行政区域！请检查行政区域名称是否有错误！');
                return false;
            }
            //console.log('地区：', areaName, '-count:', count, '  '-rs:', rs, '-rs.boundaries:',  rs.boundaries);
            //创建多边形
            var boundStr = '';
            var ply;
            var pointArray = []; //多边形点数组
            for (var i = 0; i < count; i++) {
                //console.log('rs.boundaries[i]:', rs.boundaries[i])
                boundStr += rs.boundaries[i] + ';';
                ply = new BMap.Polygon(rs.boundaries[i], { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖
                ply.setFillColor(bgColor);  //填充颜色
                ply.setFillOpacity(0.5); //透明度
                ply.name = areaName; //自定义覆盖物标识name属性
                map.addOverlay(ply);  //添加多边形覆盖物 *
                pointArray = pointArray.concat(ply.getPath());
                viewArray = viewArray.concat(ply.getPath());
            }
            
            /* var boundaries = boundStr.substr(0, boundStr.length - 1);
            var boundaryArr = boundaries.split(';');
            //console.log('boundaryArr:', boundaryArr)
            var pointsArray = [];
            for(var k = 0; k < boundaryArr.length; k++){
                var one = boundaryArr[k];
                var arr = one.split(',');
                var lng = arr[0], lat = arr[1];
                //console.log('abc:', new BMap.Point(lng, lat))
                pointsArray.push(new BMap.Point(lng, lat));
            }
            //console.log('pointsArray:', pointsArray)
            //var ply = new BMap.Polygon(boundaries, { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖
            var ply = new BMap.Polygon(pointsArray, { strokeWeight: 2, strokeColor: "#ff0000" }); //建立多边形覆盖
            ply.setFillColor(bgColor);  //填充颜色
            ply.setFillOpacity(0.5); //透明度
            map.addOverlay(ply);  //添加多边形覆盖物 */
            
            //map.setViewport(viewArray); //调整视野
            //设置文本
            var point = getCenterPoint(pointArray);
            var label = addMapLabel(areaName, areaDesc, point, ps_opts); //添加行政区域文字信息
            

            //鼠标移进移出多边形时
           /*  var label;
            ply.addEventListener('mouseover', function(){
                console.log('进入了');
                label = addMapLabel(areaName, areaDesc, point, ps_opts);
            })
            ply.addEventListener('mouseout', function(){
                console.log('出去了');
                map.removeOverlay(label);
            }) */
            /* map.addEventListener('mousemove', function(e){//鼠标移动监听事件
                if (BMapLib.GeoUtils.isPointInPolygon(e.point, ply)){
                     ply.setFillColor('green');
                     //console.log('进入了');
                    addMapLabel(areaName, areaDesc, point, ps_opts);
                     //console.log('label1:', label)
                } else {
                     ply.setFillColor('white');
                     //console.log('出去了');
                    //console.log('label2:', label)

                    var plyName = typeof ply.name == 'undefined' ? '' : ply.name;

                     var allOverlay = map.getOverlays();
                     for(var n = 0; n < allOverlay.length; n++){
                         var overlay = allOverlay[n];
                         var lbName = typeof overlay.name == 'undefined' ? '' : overlay.name;
                         if(lbName.indexOf(plyName) >= 0){
                            console.log('覆盖物：', overlay);
                            map.removeOverlay(overlay);
                            break;
                         }
                     }
                }
            }) */


        })
    }



    /**
     * 获取多边形的中心点坐标
     * @param {point} array 多边型的点数组
     * @returns {point} 返回地图坐标
     */
    function getCenterPoint(path) {
        var x = 0.0;
        var y = 0.0;
        for (var i = 0; i < path.length; i++) {
            x = x + parseFloat(path[i].lng);
            y = y + parseFloat(path[i].lat);
        }
        x = x / path.length;
        y = y / path.length;
        return new BMap.Point(x, y);
    }




    /*------------------------------------------------------------------------------------------------
    *                                       工具库
    ------------------------------------------------------------------------------------------------*/
    var utilities = {
        /**
         * 获取解析后的字符串, 即将字符串的字段名称转化成json中的实际值
         * @param {string} ps_str 原始字符串,即含有字段名称的字符串. 其中：字符名称用中括号双引号包裹. eg. '省份：["sheng"]<div>一共有楼盘["lpsl"]个</div>'
         * @param {object} ps_json 一维json. eg.{"sheng":"福建省", "lpsl":"380"}
         * @returns {string} 返回解析后的字符串. eg. '省份：福建省<div>一共有楼盘380个</div>'
         */
        getAnalysisString:function(ps_str, ps_json){
            var fieldArr = ps_str.match(/\[\"(.*?)\"\]/g);
            var new_str = ps_str; 
            if(ps_str !== '' && fieldArr != null){
                for(var k = 0; k < fieldArr.length; k++){
                    var origins = fieldArr[k];
                    var fields = origins.replace(/(.*?)\[\"(.*?)\"\](.*)/g, '$2'); //提取字段名,即提取["a"]中的a
                    new_str = new_str.replace(origins, ps_json[fields]);
                }
            }
            return new_str;
        },


        /**
         * 将驼峰写法转成短横线
         * @param {string} ps_str 驼峰写法的字符串
         * @returns {string} 返回短横线的字符串
         * eg. backgroundColor => background-color
         */
        toLowerLine:function(ps_str) {
            var temp = ps_str.replace(/[A-Z]/g, function(match) {   
                return "-" + match.toLowerCase();
            })
            if(temp.slice(0,1) === '-'){ //如果首字母是大写，执行replace时会多一个_，这里需要去掉
                temp = temp.slice(1);
            }
            return temp.replace(/([\s]+)/g, '');
        },

        /**
         * 生成随机字符串
         */
        generateRandomChar:function(){
            return Math.random().toString(36).substr(2);
        },

        /**
         * 判断字符串是否为经纬度坐标
         * @param {string} ps_str 字符串
         * @returns {boolean} 返回值：true 是经纬度坐标, false 不是经纬度坐标
         * eg. ps_str = '118.632346,24.884967', 则是经纬度坐标
         */
        stringIsCoordinate:function(ps_str){
            var reg = /^(\d+)[\.](\d+)(,)(\d+)[\.](\d+)$/g;
            return reg.test(ps_str) ? true : false;
        },

        /**
         * 获取省份对应的省会
         * @param {string} ps_sheng 省份名称
         * @returns {string} 返回省会城市
         */
        getProvinceCatital:function(ps_sheng){
            var provincial_capital = {
                // 23个省
                "台湾" : "台湾市",
                "河北" : "石家庄市",
                "山西" : "太原市",
                "辽宁" : "沈阳市",
                "吉林" : "长春市",
                "黑龙江" : "哈尔滨市",
                "江苏" : "南京市",
                "浙江" : "杭州市",
                "安徽" : "合肥市",
                "福建" : "福州市",
                "江西" : "南昌市",
                "山东" : "济南市",
                "河南" : "郑州市",
                "湖北" : "武汉市",
                "湖南" : "长沙市",
                "广东" : "广州市",
                "海南" : "海口市",
                "四川" : "成都市",
                "贵州" : "贵阳市",
                "云南" : "昆明市",
                "陕西" : "西安市",
                "甘肃" : "兰州市",
                "青海" : "西宁市",
                // 5个自治区
                "新疆" : "乌鲁木齐市",
                "广西" : "南宁市",
                "内蒙古" : "呼和浩特市",
                "宁夏" : "银川市",
                "西藏" : "拉萨市",
                // 4个直辖市
                "北京" : "东城区",
                "天津" : "河西区",
                "上海" : "浦东新区",
                "重庆" : "渝中区",
                // 2个特别行政区
                "香港" : "香港湾仔",
                "澳门" : "澳门特别行政区风顺堂区圣珊泽马路"
            }
            var capital = '';
            for(var v in provincial_capital){
                if(ps_sheng.toString().replace(/(省|自治区|市|特别行政区)/g, '').indexOf(v) >=0){
                    capital = provincial_capital[v];
                    break;
                }
            }
            return capital;
        }

        

    } //END utilities

    



    /*------------------------------------------------------------------------------------------------
    *                                       全局对象
    ------------------------------------------------------------------------------------------------*/
    // $.fn.extend({});
    $.extend({
        tooltip: { //提示信息
            noNodeTips: '错误！请绑定地图节点，节点必须用ID定义',
            noMapTips: '错误！地图尚未实例化，请使用“var map = new BMap.Map(节点ID)”进行实例化操作'
        },
        NODE: { //节点名称
            ROOTCLASS: '.meuiBdmap', //地图根节点class名称
            //ROOTID: '#' + 'meuiBdmap_' + utilities.generateRandomChar(), //地图根节点id名称
            ROOTID: '#' + 'meuiBdmap_', //地图根节点id名称
            MAPCLASS: '.bdmap_map', //地图本身节点class名称
            //MAPID: '#' + 'bdmap_' + utilities.generateRandomChar() //地图本身节点id名称
            MAPID: '#' + 'bdmap_' //地图本身节点id名称
        },      
        MAPER: null, //对图对象Map
        IMAGEDRAGED: false, //自定义标注点图标是否可拖动
        IMAGEENABLE: false, //是否开启自定义标注点图标
        IMAGEPATH: '', //自定义标注点图片文件夹相对静态文件html位置
        IMAGEICON: '', //自定义标注点图标名称(.png)
        ENABLEVIEWPORT: false, //是否强制调整视野,即强制地图显示到某个视野,默认false(可选). 因centerAndZoom是异步,故要使用setViewport起作用,必须设置本参数值为true.
        AUTOVIEWPORT: true //是否自动使用setViewport(), 默认true, 仅当enableViewPort=true时有效. 值：true 系统自动调整视野, false 前端手动调整视野(须自己写代码)
    })




    /*------------------------------------------------------------------------------------------------
    *                                       对外暴露插件接口
    ------------------------------------------------------------------------------------------------*/
    $.fn.meuiBaiduMap = function(method){
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            return methods.init.apply(this, arguments);
        }else{
            $.error('Method ' + method + ' does not exist in jQuery.meuiBaiduMap');
        }
    }


})(jQuery);



//testing
var meuiBaiduMap = function(method){
    var $dom = $('body');
    $dom.meuiBaiduMap.apply(null, Array.prototype.slice.call(arguments, 0));
}