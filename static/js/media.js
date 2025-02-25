/*
Using vanilla JavaScript's Fetch API to request the JSON data and then render it.
Note: If you prefer to use jQuery and its AJAX functionality, you might need to use the full version of jQuery instead of the slim version.
*/

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'https://black-sun-84b9.fpzw5pvb5j.workers.dev/?url=https://app.bfzyapi.com/api.php/provide/vod/?ac=list';
    
    // Use the Fetch API to get and process JSON
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        renderVodList(data);
      })
      .catch(error => {
        console.error('Error fetching API data:', error);
        document.getElementById('vod-list').textContent = 'Error loading data.';
      });
      
    // const data = {"code":1,"msg":"数据列表","page":1,"pagecount":4229,"limit":"20","total":84574,"list":[{"vod_id":84858,"vod_name":"陛下这纨绔开挂了","type_id":65,"type_name":"重生民国","vod_en":"bixiazhewankukaigualiao","vod_time":"2025-02-25 13:53:02","vod_remarks":"已完结","vod_play_from":"bfzym3u8"},{"vod_id":84875,"vod_name":"格罗斯波因特园艺社群","type_id":37,"type_name":"海外剧","vod_en":"geluosiboyinteyuanyishequn","vod_time":"2025-02-25 12:50:01","vod_remarks":"更新至第01集","vod_play_from":"bfzym3u8"},{"vod_id":84571,"vod_name":"刑侦现场","type_id":31,"type_name":"国产剧","vod_en":"xingzhenxianchang","vod_time":"2025-02-25 12:46:01","vod_remarks":"更新至第10集","vod_play_from":"bfzym3u8"},{"vod_id":82803,"vod_name":"秘密2025","type_id":36,"type_name":"日本剧","vod_en":"mimi2025","vod_time":"2025-02-25 12:46:01","vod_remarks":"更新至第05集","vod_play_from":"bfzym3u8"},{"vod_id":82337,"vod_name":"119紧急呼叫","type_id":36,"type_name":"日本剧","vod_en":"119jinjihujiao","vod_time":"2025-02-25 12:46:01","vod_remarks":"更新至第06集","vod_play_from":"bfzym3u8"},{"vod_id":84684,"vod_name":"佔有姜西","type_id":31,"type_name":"国产剧","vod_en":"zhanyoujiangxi","vod_time":"2025-02-25 12:41:01","vod_remarks":"更新至第12集","vod_play_from":"bfzym3u8"},{"vod_id":84556,"vod_name":"弊家伙！我要去祓魔","type_id":33,"type_name":"香港剧","vod_en":"bijiahuowoyaoqufumo","vod_time":"2025-02-25 12:40:01","vod_remarks":"更新至第11集","vod_play_from":"bfzym3u8"},{"vod_id":84874,"vod_name":"你是我唯一的偏爱","type_id":69,"type_name":"女恋总裁","vod_en":"nishiwoweiyidepianai","vod_time":"2025-02-25 12:27:02","vod_remarks":"全70集","vod_play_from":"bfzym3u8"},{"vod_id":84873,"vod_name":"上海滩之龙凤会","type_id":66,"type_name":"穿越年代","vod_en":"shanghaitanzhilongfenghui","vod_time":"2025-02-25 12:27:02","vod_remarks":"全93集","vod_play_from":"bfzym3u8"},{"vod_id":84872,"vod_name":"摄政王妃她医毒双绝","type_id":66,"type_name":"穿越年代","vod_en":"shezhengwangfeitayidushuangjue","vod_time":"2025-02-25 12:27:02","vod_remarks":"全80集","vod_play_from":"bfzym3u8"},{"vod_id":84871,"vod_name":"时光予你我偏爱","type_id":69,"type_name":"女恋总裁","vod_en":"shiguangyuniwopianai","vod_time":"2025-02-25 12:27:02","vod_remarks":"全100集","vod_play_from":"bfzym3u8"},{"vod_id":84870,"vod_name":"庶女深宫策","type_id":72,"type_name":"古装仙侠","vod_en":"shunvshengongce","vod_time":"2025-02-25 12:27:02","vod_remarks":"全64集","vod_play_from":"bfzym3u8"},{"vod_id":84869,"vod_name":"五十而立短剧","type_id":67,"type_name":"现代言情","vod_en":"wushierliduanju","vod_time":"2025-02-25 12:27:01","vod_remarks":"全62集","vod_play_from":"bfzym3u8"},{"vod_id":84868,"vod_name":"愿君安宁","type_id":72,"type_name":"古装仙侠","vod_en":"yuanjunanning","vod_time":"2025-02-25 12:27:01","vod_remarks":"全34集","vod_play_from":"bfzym3u8"},{"vod_id":84867,"vod_name":"挚爱救赎","type_id":67,"type_name":"现代言情","vod_en":"zhiaijiushu","vod_time":"2025-02-25 12:27:01","vod_remarks":"全59集","vod_play_from":"bfzym3u8"},{"vod_id":84866,"vod_name":"重返十八拒绝校花","type_id":66,"type_name":"穿越年代","vod_en":"zhongfanshibajujuexiaohua","vod_time":"2025-02-25 12:27:01","vod_remarks":"全76集","vod_play_from":"bfzym3u8"},{"vod_id":80478,"vod_name":"友间合租屋","type_id":31,"type_name":"国产剧","vod_en":"youjianhezuwu","vod_time":"2025-02-25 12:26:03","vod_remarks":"更新至第2025025期","vod_play_from":"bfzym3u8"},{"vod_id":84865,"vod_name":"直面疾风吧","type_id":46,"type_name":"大陆综艺","vod_en":"zhimianjifengba","vod_time":"2025-02-25 12:26:01","vod_remarks":"更新至20250225期","vod_play_from":"bfzym3u8"},{"vod_id":84864,"vod_name":"风铃转君心动","type_id":72,"type_name":"古装仙侠","vod_en":"fenglingzhuanjunxindong","vod_time":"2025-02-25 12:26:01","vod_remarks":"全42集","vod_play_from":"bfzym3u8"},{"vod_id":84863,"vod_name":"后宅蔷薇花开久","type_id":72,"type_name":"古装仙侠","vod_en":"houzhaiqiangweihuakaijiu","vod_time":"2025-02-25 12:26:01","vod_remarks":"全92集","vod_play_from":"bfzym3u8"}],"class":[{"type_id":20,"type_pid":0,"type_name":"电影片"},{"type_id":21,"type_pid":20,"type_name":"动作片"},{"type_id":22,"type_pid":20,"type_name":"喜剧片"},{"type_id":23,"type_pid":20,"type_name":"恐怖片"},{"type_id":24,"type_pid":20,"type_name":"科幻片"},{"type_id":25,"type_pid":20,"type_name":"爱情片"},{"type_id":26,"type_pid":20,"type_name":"剧情片"},{"type_id":27,"type_pid":20,"type_name":"战争片"},{"type_id":28,"type_pid":20,"type_name":"纪录片"},{"type_id":29,"type_pid":20,"type_name":"理论片"},{"type_id":30,"type_pid":0,"type_name":"连续剧"},{"type_id":31,"type_pid":30,"type_name":"国产剧"},{"type_id":32,"type_pid":30,"type_name":"欧美剧"},{"type_id":33,"type_pid":30,"type_name":"香港剧"},{"type_id":34,"type_pid":30,"type_name":"韩国剧"},{"type_id":35,"type_pid":30,"type_name":"台湾剧"},{"type_id":36,"type_pid":30,"type_name":"日本剧"},{"type_id":37,"type_pid":30,"type_name":"海外剧"},{"type_id":38,"type_pid":30,"type_name":"泰国剧"},{"type_id":39,"type_pid":0,"type_name":"动漫片"},{"type_id":40,"type_pid":39,"type_name":"国产动漫"},{"type_id":41,"type_pid":39,"type_name":"日韩动漫"},{"type_id":42,"type_pid":39,"type_name":"欧美动漫"},{"type_id":43,"type_pid":39,"type_name":"港台动漫"},{"type_id":44,"type_pid":39,"type_name":"海外动漫"},{"type_id":45,"type_pid":0,"type_name":"综艺片"},{"type_id":46,"type_pid":45,"type_name":"大陆综艺"},{"type_id":47,"type_pid":45,"type_name":"港台综艺"},{"type_id":48,"type_pid":45,"type_name":"日韩综艺"},{"type_id":49,"type_pid":45,"type_name":"欧美综艺"},{"type_id":50,"type_pid":20,"type_name":"动画片"},{"type_id":51,"type_pid":0,"type_name":"电影解说"},{"type_id":52,"type_pid":0,"type_name":"预告片"},{"type_id":53,"type_pid":0,"type_name":"体育赛事"},{"type_id":54,"type_pid":53,"type_name":"足球"},{"type_id":55,"type_pid":53,"type_name":"篮球"},{"type_id":56,"type_pid":53,"type_name":"网球"},{"type_id":57,"type_pid":53,"type_name":"斯诺克"},{"type_id":58,"type_pid":0,"type_name":"短剧大全"},{"type_id":65,"type_pid":58,"type_name":"重生民国"},{"type_id":66,"type_pid":58,"type_name":"穿越年代"},{"type_id":67,"type_pid":58,"type_name":"现代言情"},{"type_id":68,"type_pid":58,"type_name":"反转爽文"},{"type_id":69,"type_pid":58,"type_name":"女恋总裁"},{"type_id":70,"type_pid":58,"type_name":"闪婚离婚"},{"type_id":71,"type_pid":58,"type_name":"都市脑洞"},{"type_id":72,"type_pid":58,"type_name":"古装仙侠"},{"type_id":73,"type_pid":0,"type_name":"福利"}]};
    // renderVodList(data);
    // Function to render the list of videos
    function renderVodList(data) {
      const container = document.getElementById('vod-list');
      container.innerHTML = '';  // clear "loading" message
      
      // Make sure data.list exists and is an array
      if (data.list && Array.isArray(data.list)) {
        data.list.forEach(item => {
          // Create a container div for each video item
          let vodDiv = document.createElement('div');
          vodDiv.className = 'vod-item';
      
          // Video title
          let title = document.createElement('h2');
          title.textContent = item.vod_name;
          vodDiv.appendChild(title);
      
          // Metadata (category, release time, and remarks)
          let meta = document.createElement('p');
          meta.className = 'meta';
          meta.textContent = `Category: ${item.type_name} | Released: ${item.vod_time} | Remarks: ${item.vod_remarks}`;
          vodDiv.appendChild(meta);
      
          // Append the video div to the container
          container.appendChild(vodDiv);
        });
      } else {
        container.textContent = 'No video data available.';
      }
    }
});
