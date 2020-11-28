/**
Author : aditia_dtz © 2020
Date : Sat Nov 28 12:54:15 WIB 2020
books downloader from goalkicker.com

contact : https://t.me/aditia_dtz
**/
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const readline = require('readline')

const prompt = readline.createInterface({
	input:process.stdin,
	output:process.stdout
});

var cyan = "\033[36m"
var white = "\033[37m"
var banner = (`
	.)..)..)
	███████ ═╮
	███████ ▏∥    buy me a coffee
	███████ ═╯
	◥█████◤

`)

function GoalKicker(){
	var url = 'https://books.goalkicker.com/'
	var npage = [];
	request({
		url : `${url}`,
		method : 'GET',
	},(err, resp, body) => {
		if(!err && resp.statusCode == 200){
			console.log(banner);
			const $ = cheerio.load(body)
			$("div[class='bookContainer grow']").each((i,e) => {
				npage.push($(e).find('a').attr('href'));
				console.log(` ${cyan}(${white}${i+1}${cyan}).${white} ${$(e).text()}`);
			}); prompt.question(' (chos) ',(cos) => {
					if(cos !== '' && (cos-1) < npage.length){
						request({
							url:`${url}` + `${npage[cos-1]}`,
							method:'GET',
						},(err,resp,body) => {
							if(err) throw err;
							var $ = cheerio.load(body)
							var link = $("button[class='download']").attr('onclick').match(/='(.*?)'/i);
							if(link !== null){
								prompt.question(' (path) ', (path) => {
									if(path !== ''){
										if(fs.existsSync(path)){
											request(`${url}` + `${npage[cos-1]}` + `${link[1]}`)
												.pipe(
													fs.createWriteStream(
														`${path}` + `${link[1]}`
														)
													);
											console.log(' (okay) waiting to save file');
										} else {
											console.error(` (error) Can't find directory ${path}`)
										}
									} else {
										console.error(' (error) input path to save file');
									}
								prompt.close();
								});
							}
						});
					}
				});
		}else{
			throw err;
		}
	});
}

GoalKicker();
