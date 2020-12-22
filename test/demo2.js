    /**
     * meuiBdmap 演示
     */



     
    /*+----------------------------------------+*/
    //=====综合案例
    //楼盘一张图
    /*+-------------------全局变量---------------------+*/
    var g_centPoints = ''; //中心点坐标,默认空

    //=====地图初始化
    var mapDom = $('#test301');
    mapDom.meuiBaiduMap('init', {
        city: '泉州市', //默认中心点城市
        point: '118.611836,24.918225', //默认中心点经纬度坐标
        isNumc: false, //地图中心点是根据城市还是坐标来设置. true 根据坐标(true), false 根据城市
        zoom: 3, //地图缩放级别(值:3-19)
        copyright: '福建华审评估公司版权所有 (<span style="font-size:12px">version 1.0.0</span>)', //版权信息
        width: 800, 
        height: 800,
        image: { //自定义坐标标注点图标及其它属性(可选) testing
            draged: false, //图标是否可拖动,默认false(可选)
            enable: true, //是否开启自定义图标, 默认false(可选)
            path: 'assets/img/', //图片文件夹相对静态文件html位置,仅当enable=true时有效(可选)
            icon: 'bmap_locate_blue.png' //图标文件名,仅当enable=true时有效(可选)
        },
        showMode: 'normal', //显示方式(可选). normal 固定显示,即在绑定节点上直接显示, click 点击显示(默认)
        //enableViewPort: false, //是否强制调整视野,即强制地图显示到某个视野,默认false(可选). 因centerAndZoom是异步,故要让使用setViewport起作用,必须设置本参数值为true.
        //autoViewPort: false, //是否系统自动调整视野,默认true,仅当enableViewPort=true时有效(可选). 值：true 系统调用setViewport自动调整视野, false 前端手动调用setViewport调整视野(需设置延时,否则不起作用)
        callBack: function(e){ //回调：初始化后
            var map = e.map;
            var $this = e.dom;
            var source = get_data_province();
            generateBbMapPoint($this, source, 'area[initiate]');
        },
        mouseScroll: function(e){ //回调：鼠标滚动地图时
            scrollDragClickEvent(e);
        },
        mouseClick: function(e){ //回调：鼠标点击地图时
            var lng = e.point.lng, lat = e.point.lat;
            //console.log('您点击的地方坐标为经纬度：', [lng, lat]);
            g_centPoints = lng + ','+ lat; //全局赋值  
        },
        mouseDoubleClick: function(e){
            scrollDragClickEvent(e);
        },
        mouseDrag: function(e){ //回调：鼠标拖拽地图时
            var lng = e.point.lng, lat = e.point.lat;
            //console.log('您拖拽的地方坐标为经纬度：', [lng, lat]);
            g_centPoints = lng + ','+ lat; //全局赋值

            var event = e.event;
            if(event == 'dragstart'){
                //console.log('拖拽开始')
            }
            if(event == 'dragging'){
                //console.log('拖拽进行中')
            }
            if(event == 'dragend'){
                //console.log('拖拽结束');
                scrollDragClickEvent(e);
            }
        }
    });



    //=====公用事件：地图上鼠标滚动、拖拽、点击时
    function scrollDragClickEvent(e){
        var $this = e.dom;
        var zoom = e.zoom;
        var center = $this.meuiBaiduMap('getCenter');
        var ls_zw = center.lng + ',' + center.lat;
        //console.log('中心点坐标：', point, '\当前点击的点坐标：',g_centPoints);
        if(g_centPoints != '') point = g_centPoints;
        //console.log('当前地图绽放级别：', zoom, ' 中心点:', center, ' 坐标：', point);                
        if(zoom <= 5 ){ //显示省数据
            var source = get_data_province();
            generateBbMapPoint($this, source, 'area[province]');
        }
        else if(zoom <= 7){ //显示市数据
            var source = get_data_city(ls_zw);
            generateBbMapPoint($this, source, 'area[city]');
        }
        else if(zoom <= 10){ //显示区县数据
            var source = get_data_county(ls_zw);
            generateBbMapPoint($this, source, 'area[county]');
        }
        else if(zoom <= 15){ //显示楼盘数据
            var source = get_data_house(ls_zw, 1);
            generateBbMapPoint($this, source, 'house[price]');
        }
        else if(zoom <= 19){ //显示楼盘数据
            var source = get_data_house(ls_zw, 2);
            generateBbMapPoint($this, source, 'house[room]');
        }
    }


    /**
     * 公用函数：创建百度地图坐标点
     * @param {object} ps_dom 生成地图的根节点DOM
     * @param {ps_source} ps_source 数据源
     * @param {object} ps_type 数据类别. area[initiate] 地区初始化, area[province] 省份, area[city] 城市, area[county] 区县, house[price] 楼盘均价, house[room]楼盘房号信息
     */
     function generateBbMapPoint(ps_dom, ps_source, ps_type){
        var ps_other = {}; //其它参数
        if(ps_type.indexOf('area') >= 0){ //第1-3级
            var titleStr = '<strong>["name"]</strong><br>楼盘数量：["lpsl"]个';
            if(ps_type.indexOf('initiate') >= 0) titleStr = '["name"]';
            ps_other = {
                format: {  //自定义数据源字段名称(可选). 方便后台传输任意的字段名,前端只需自定义一下即可
                    coordinates: '["zuobiao"]', //经纬度坐标
                    title: titleStr, //文字标题,标注点文字
                    //id: '["bh"]', //记录主键key(可选)
                    description: '<strong>["name"]</strong><br>楼盘数量：["lpsl"]个' //描述,信息窗文字(可选)
                },
                dbClickMarkerAutoScale: true, //是否开启双击标注点图标后地图缩放级别自动放大一级,默认false(可选)
                infoEnable: false, //是否开启信息窗,默认true(可选). 优先权大于单条数据里的isInfo字段
                //回调
                markerDoubleClickBack: function(e){ //双击标注点图标后会触发此事件(可选). e参数：{id:"记录主键值"}
                    //console.log('你双击了标注点图标e：', e);
                    scrollDragClickEvent(e);
                }
            }
        }
        else if(ps_type.indexOf('house') >= 0){
            var formatJson = {}
            if(ps_type.indexOf('price') >= 0){ //第4级
                formatJson = {
                    coordinates: '["zuobiao"]',
                    title: '["price_avg"]元/m²',
                    id: '["qydcb_bh"]',
                    description: '<em class=\"bdtitle\">["qydcb_mc"]</em><br><em class=\"bdaddress\">均价：["price_avg"]元/m²</em>'
                }
            }else if(ps_type.indexOf('room') >= 0){ //第5级
                formatJson = {
                    coordinates: '["zuobiao"]',
                    title: '["qydcb_mc"]<br>["price_avg"]元/m²',
                    id: '["qydcb_bh"]',
                    description: '<em class=\"bdtitle\">["qydcb_mc"]</em><br><em class=\"bdaddress\">均价：["price_avg"]元/m²</em><button class="btn-details">详情</div>'
                }
            }
            
            ps_other = {
                format: formatJson, 
                dbClickMarkerAutoScale: true,
                markerDoubleClickBack: function(e){
                    //console.log('你双击了标注点图标e：', e);
                    scrollDragClickEvent(e);
                },
                infoEventsFunc: function (e) { //信息窗内部DOM操作系列事件(可选)
                    //console.log('详情e:', e);
                    //详情按钮
                    $('.btn-details').off('click').on('click',function(){
                        var ls_qydcb_bh = e.id;
                            ls_lng = e.point.lng, //经度
                            ls_lat = e.point.lat; //纬度
                        //打开iframe
                        alert('详情按钮点击事件');
                        console.log('楼盘编号：', ls_qydcb_bh, '经纬度：',[ls_lng, ls_lat]);
                    })
                }
            }
        }
        //创建坐标点
        ps_dom.meuiBaiduMap(
            'createMapPoint',
            ps_source,
            ps_other
        )
    }




    /*+----------------FUNCTION----------------+*/
    /**
     * 获取省份数据
     * @returns {array} 返回省份数组
     */
    function get_data_province(){
        //后台返回
        var json = {
            data:[
                {"bh":"1001", "name":"山东省", "zuobiao":"117.124638,36.680865", "lpsl":"1000", "dragging":false}, //testing
                {"bh":"1002", "name":"江苏省", "zuobiao":"118.835587,32.092177", "lpsl":"2000"},
                {"bh":"1003", "name":"安徽省", "zuobiao":"117.198227,31.825526", "lpsl":"3000"},
                {"bh":"1004", "name":"浙江省", "zuobiao":"117.198227,31.825526", "lpsl":"4000"},
                {"bh":"1005", "name":"江西省", "zuobiao":"115.873622,28.695811", "lpsl":"5000"},
                {"bh":"1006", "name":"湖南省", "zuobiao":"112.911657,28.273173", "lpsl":"6000"},
                {"bh":"1007", "name":"福建省", "zuobiao":"119.277122,26.101584", "lpsl":"7000"},
                {"bh":"1008", "name":"广东省", "zuobiao":"113.298,23.141953", "lpsl":"8000"},
                {"bh":"1009", "name":"广西省", "zuobiao":"113.298,23.141953", "lpsl":"9000"}
            ]
        }
        return json;
    }


    /**
     * 获取城市数据
     * @param {point} ps_zuobiao 中心点坐标
     * @returns {array} 返回城市数组
     */
    function get_data_city(ps_zuobiao){
        //后台返回
        var json = {
            data:[
                {"bh":"1001", "name":"福州市", "zuobiao":"119.295519,26.087047", "lpsl":"100"},
                {"bh":"1002", "name":"厦门市", "zuobiao":"118.108893,24.506535", "lpsl":"200"},
                {"bh":"1003", "name":"莆田市", "zuobiao":"119.019559,25.470709", "lpsl":"900"},
                {"bh":"1004", "name":"三明市", "zuobiao":"117.670593, 26.231752", "lpsl":"300"},
                {"bh":"1005", "name":"泉州市", "zuobiao":"118.679209,24.901512", "lpsl":"400"},
                {"bh":"1006", "name":"漳州市", "zuobiao":"117.648961,24.531784", "lpsl":"500"},
                {"bh":"1007", "name":"南平市", "zuobiao":"118.099695,27.408443", "lpsl":"600"},
                {"bh":"1008", "name":"龙岩市", "zuobiao":"117.014254,25.102712", "lpsl":"700"},
                {"bh":"1009", "name":"宁德市", "zuobiao":"119.553081,26.683596", "lpsl":"800"}
            ]
        }
        return json;
    }


    /**
     * 获取区县数据
     * @param {point} ps_zuobiao 中心点坐标
     * @returns {array} 返回区县数组 
     */
    function get_data_county(ps_zuobiao){
        //后台返回
        var json = {
            data:[
                {"bh":"1001", "name":"鲤城区", "zuobiao":"118.588948,24.91567", "lpsl":"850"},
                {"bh":"1002", "name":"丰泽区", "zuobiao":"118.619706,24.896006", "lpsl":"750"},
                {"bh":"1003", "name":"洛江区", "zuobiao":"118.673173,24.952629", "lpsl":"650"},
                {"bh":"1004", "name":"泉港区", "zuobiao":"118.921824,25.142493", "lpsl":"550"},
                {"bh":"1005", "name":"石狮市", "zuobiao":"118.661962,24.739893", "lpsl":"450"},
                {"bh":"1006", "name":"晋江市", "zuobiao":"118.563077,24.828075", "lpsl":"350"},
                {"bh":"1007", "name":"南安市", "zuobiao":"118.236525,25.495758", "lpsl":"250"},
                {"bh":"1008", "name":"惠安县", "zuobiao":"118.799942,25.039873", "lpsl":"150"},
                {"bh":"1009", "name":"安溪县", "zuobiao":"118.799942,25.039873", "lpsl":"100"},
                {"bh":"1010", "name":"永春县", "zuobiao":"118.289417,25.330752", "lpsl":"80"},
                {"bh":"1011", "name":"德化县", "zuobiao":"118.236525,25.495758", "lpsl":"60"}
            ]
        }
        return json;
    }


    /**
     * 获取楼盘数据
     * @param {point} ps_zuobiao 中心点坐标
     * @param {number} ps_dengji 缩放等级. 1 第4级(倒数第二级), 2 第5级(最后一级)
     * @returns {array} 返回楼盘数组 
     */
    function get_data_house(ps_zuobiao, ps_dengji){
        //后台返回
        var json = {
            data: [
                {"qydcb_bh":"1001", "zuobiao": "118.618592,24.908369", "qydcb_mc": "泉州国税局大厦", "price_avg":"13500", "ms": "泉州市丰泽区丰泽街中段" },
                {"qydcb_bh":"1002", "zuobiao": "118.613382,24.915539", "qydcb_mc": "北峰万科城", "price_avg":"13500", "ms": "<em class=\"bdtitle\">北峰万科城</em><em class=\"bdaddress\">泉州市丰泽区北峰池峰路13号</em><br>共4栋15单元,合计12365平米<br>在租15单元,9996.66平米,66.55%<br>在押12单元,1258.88平米,88.55%<br>在评8单元,962.33平米,33.33% <button id=\"btn-more1\">更多1</button> <button id=\"btn-more2\">更多2</button>" },
                {"qydcb_bh":"1003", "zuobiao": "118.614711,24.912884", "qydcb_mc": "万科上悦城", "price_avg":"13500", "ms": "泉州市清濛经济技术开发区1号" },
                {"qydcb_bh":"1004", "zuobiao": "118.60695,24.917538", "qydcb_mc": "聚龙小镇", "price_avg":"13500", "ms": "泉州市惠安县惠南大道52号" },
                {"qydcb_bh":"1005", "zuobiao": "118.605225,24.913474", "qydcb_mc": "富临国际", "price_avg":"13500", "ms": "泉州市丰泽区丰泽街北段" },
                {"qydcb_bh":"1006", "zuobiao": "118.618628,24.917439", "qydcb_mc": "闻馨一品", "price_avg":"13500", "ms": "泉州市鲤城区南环路52号" },
                {"qydcb_bh":"1007", "zuobiao": "118.613597,24.909279", "qydcb_mc": "建发珑月湾", "price_avg":"13500", "ms": "泉州市江南产业园区25号" }
            ]
        }
        return json;
    }