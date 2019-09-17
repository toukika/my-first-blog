const express = require('express');
const app = express();
const cheerio = require('cheerio');
const superagent= require('superagent');

let server = app.listen(3000,function(){
	let host = server.address().address;
	let port = server.address().port;
	console.log('Your App is running at http://%s:%s', host, port);
})

/*app.get('/', function (req, res) {
  res.send('Hello World!');
});*/
let categoryDetail = [];
let categoryPage = [];
let url = 'https://www.amazon.co.jp/s?k=%E3%81%82%E3%81%84%E3%81%BF%E3%82%87%E3%82%93'
let baseurl = 'https://www.amazon.co.jp'

superagent.get(url).end((err, res) => {
  if (err) {
    // アクセスが失敗するかエラーが発生した場合、この行はここにあります。
    console.log(`クローラ失敗しました - ${err}`)
  } else {
   // 成功したアクセス，要求ページによって返されたデータは、resに含まれます
   // クローラページ実行
   categoryPage = getCategoyUrl(res)
  }
});



let getCategoyUrl = (res) => {
  let categoryPage = [];
  // 成功したアクセス，requestページによって返されたデータは、res.textに含まれます。
  /* cheerioモジュールのcherrio.load（）メソッドを使用して、HTMLドキュメントをパラメーターとして関数に渡します
     以降、jQueryの$（selectior）メソッドを使用してページ要素を取得できます。
   */
  let $ = cheerio.load(res.text);
  // 目標データのページ要素を見つけてデータを取得します。
  $('#filters > ul:nth-child(8) > li > span >　a').each((idx, ele) => {
    // cherrio中$('selector').each()
    // idx：索引，eleは現在トラバースされているDOM要素です
    //let  = $(ele).attr('href')
    let url = $(ele).attr('href')    	// カテゴリーのurlを取得します


    let searchUrl = baseurl+url

　  superagent.get(searchUrl).end((err, res1) => {
  　  if (err) {
    　  // アクセスが失敗するかエラーが発生した場合、この行はここにあります。
    　  console.log(`クローラ失敗しました - ${err}`)
  　  } else {

   　  // 成功したアクセス，要求ページによって返されたデータは、resに含まれます
   　  // クローラページ実行
     		let $ = cheerio.load(res1.text);
  	   	if (url.includes("sr_nr_p_n_srvg_2374648051_1")){

  	   		$('#search > div.sg-row > div.sg-col-20-of-24.sg-col-28-of-32.sg-col-16-of-20.sg-col.s-right-column.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-result-list.s-search-results.sg-row > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a').each((idx, ele1) => {
  	   			let productUrl = $(ele1).attr('href')
  	   			detailUrl = baseurl + productUrl
  	   			superagent.get(detailUrl).end((err,res2)=>{
  	   				if(err){
  	   					console.log(`クローラ失敗しました - ${err}`)
  	   				}else{
  	   					let $ = cheerio.load(res2.text);
                if ($('#desktop-dp-sims_purchase-similarities-sims-feature > div') !== null){
                  $('#desktop-dp-sims_purchase-similarities-sims-feature > div').each((idx, pri) => {
                    let divAtrr=$(pri).attr('data-a-carousel-options')
                    let obj = JSON.parse(divAtrr)['ajax']['id_list']
                    for(let val of obj){
                       let itemASIN = val.match(/[A-Z0-9]{10}/)
                       nameUrl = baseurl+'/dp/'+itemASIN
                       let namelist = []
                       superagent.get(nameUrl).end((err,res3)=>{
                        if(err){
                          console.log(`クローラ失敗しました - ${err}`)
                        }else{
                          let $ = cheerio.load(res3.text);
                          if($('#bylineInfo > span.author.notFaded > a')!==null){
                            $('#bylineInfo > span.author.notFaded > a').each((idx,na)=>{
                              let name = $(na).text()
                              namelist.push(name)
                              for(let nam of namelist){
                                num = nam.keys(namelist).length

                                let detail = {
                                  name: name,
                                  //number:num,
                                  category:'CD'
                                }
                                categoryPage.push(detail)
                              }
                             
                            });
                          }
                        }
                       });
                    }
                    //let keys= Object.keys(obj);
                   
                  });
                }
  	   				}
  	   			});
  	   			
  	   		});
  	   	}


        /*else if (url.includes("ref=sr_nr_p_n_srvg_2374648051_2")){

          $('#search > div.sg-row > div.sg-col-20-of-24.sg-col-28-of-32.sg-col-16-of-20.sg-col.s-right-column.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-result-list.s-search-results.sg-row > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a').each((idx, ele1) => {
            let productUrl = $(ele1).attr('href')
            detailUrl = baseurl + productUrl
            superagent.get(detailUrl).end((err,res3)=>{
              if(err){
                console.log(`クローラ失敗しました - ${err}`)
              }else{
                let $ = cheerio.load(res3.text);
                if ($('#desktop-dp-sims_purchase-similarities-sims-feature > div') !== null){
                   $('#desktop-dp-sims_purchase-similarities-sims-feature > div').each((idx, pri) => {
                  
                    let divAtrr=$(pri).attr('data-a-carousel-options')
                    let obj = JSON.parse(divAtrr)['ajax']['id_list']
                    //let keys= Object.keys(obj);
                    categoryPage.push(obj)
                  });
                }
              }
            });
            
          });
        }


        else if (url.includes("ref=sr_nr_p_n_srvg_2374648051_3")){

          $('#search > div.sg-row > div.sg-col-20-of-24.sg-col-28-of-32.sg-col-16-of-20.sg-col.s-right-column.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-result-list.s-search-results.sg-row > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a').each((idx, ele1) => {
            let productUrl = $(ele1).attr('href')
            detailUrl = baseurl + productUrl
            superagent.get(detailUrl).end((err,res4)=>{
              if(err){
                console.log(`クローラ失敗しました - ${err}`)
              }else{
                let $ = cheerio.load(res4.text);
                
                if ($('#desktop-dp-sims_purchase-similarities-sims-feature > div') !== null){
                   $('#desktop-dp-sims_purchase-similarities-sims-feature > div').each((idx, pri) => {
                  
                    let divAtrr=$(pri).attr('data-a-carousel-options')
                    let obj = JSON.parse(divAtrr)['ajax']['id_list']
                    //let keys= Object.keys(obj);
                    categoryPage.push(obj)
                  });
                }
              }
            });
            
          });
        }*/

   		//categoryDetail = categoryDetailPage(res1)
   　 //return categoryDetail
  　  }
　  });
    //categoryPage.push(url)              // 最終結果リストに保存します
  });
  return categoryPage

};

let categoryDetailPage = (res1) => {
	let categoryDetail = [];
	let $ = cheerio.load(res1.text);
	if (url.includes("sr_nr_p_n_srvg_2374648051_1")){

   		$('#search > div.sg-row > div.sg-col-20-of-24.sg-col-28-of-32.sg-col-16-of-20.sg-col.s-right-column.sg-col-32-of-36.sg-col-8-of-12.sg-col-12-of-16.sg-col-24-of-28 > div > span:nth-child(4) > div.s-result-list.s-search-results.sg-row > div:nth-child > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a').each((idx, ele1) => {
   			let productUrl = $(ele1).attr('href')
   			categoryDetail.push(productUrl)
   		});
   		
   	}

   	return categoryDetail
};

app.get('/', async (req, res, next) => {
  res.send(categoryPage);
});