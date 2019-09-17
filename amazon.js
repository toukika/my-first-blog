const express = require('express');
const app = express();
const cheerio = require('cheerio');
const superagent= require('superagent');
const request = require('request-promise');


let server = app.listen(3000,function(){
	let host = server.address().address;
	let port = server.address().port;
	console.log('Your App is running at http://%s:%s', host, port);
})


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
	let $ = cheerio.load(res.text);
	$('#filters > ul:nth-child(8) > li > span > a').each((idx, ele) => {
		let url = $(ele).attr('href')
		let searchUrl = baseurl+url
		superagent.get(searchUrl).end((err, res1) => {
			if(err){
				console.log(`クローラ失敗しました - ${err}`)
			}else{
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
										categoryPage.push(obj)
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
														});
													}
												}
											});
										}
									});
								}
							}
						});
						
					});

				}

			}
		});
		
	});

	return categoryPage
};


app.get('/', async (req, res, next) => {
	res.send(categoryPage);
});