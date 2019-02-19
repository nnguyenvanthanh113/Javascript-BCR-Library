/*
 
Cordova BCR Library 0.0.4
Authors: Gaspare Ferraro, Renzo Sala
Contributors: Simone Ponte, Paolo Macco
Filename: bcr.utility.js
Description: various utilities

*/

function titleCase(text) {
    if (!text) return text;
    if (typeof text !== 'string') throw "invalid argument";

    return text.toLowerCase().split(' ').map(value => {
        return value.charAt(0).toUpperCase() + value.substring(1);
    }).join(' ');
}

function editDistance(word1, word2) {
	var i, j, Cmin;
	if(word1 == undefined && word2 == undefined){
		return 1;
	}
	if(word1 == undefined || word1.length === 0){
		return word2.length;
	}
	if(word2 == undefined || word2.length === 0){
		return word1.length;
	}
	
	word1 = word1.toLowerCase();
	word2 = word2.toLowerCase();
	
	var len1 = word1.length;
	var len2 = word2.length;
	
	var dp = Array(len1+1).fill(0).map(x =>Array(len2+1).fill(0));
	
	for(i = 0; i<=len1; i++){
		dp[i][0] = i;
	}
	for(j = 0; j<=len2; j++){
		dp[0][j] = j;
	}
	
	for(i = 0; i<len1; i++){
		var c1 = word1.charAt(i);
		
		for(j = 0; j<len2; j++){
			var c2 = word2.charAt(j);
			
			if(c1 == c2){
				dp[i+1][j+1] = dp[i][j];
			}
			else{
				var Creplace = dp[i][j]+1;
				var Cinsert = dp[i][j+1]+1;
				var Cdelete = dp[i+1][j]+1;
				
				Cmin = Math.min(Creplace, Math.min(Cinsert, Cdelete));
				dp[i+1][j+1] = Cmin;
			}
		}
	}
	
	return dp[len1][len2];
}

function substringEditDistance(word1, word2) {
	var i, j, Cmin;
	if(word1 == undefined && word2 == undefined){
		return 1;
	}
	if(word1 == undefined || word1.length === 0){
		return word2.length;
	}
	if(word2 == undefined || word2.length === 0){
		return word1.length;
	}
	
	word1 = word1.toLowerCase();
	word2 = word2.toLowerCase();
	
	var len1 = word1.length;
	var len2 = word2.length;
	
	var dp = Array(len1+1).fill(0).map(x =>Array(len2+1).fill(0));
	
	for(i = 0; i<=len1; i++){
		dp[i][0] = i;
	}
	for(j = 0; j<=len2; j++){
		dp[0][j] = 0;
	}
	
	for(i = 0; i<len1; i++){
		var c1 = word1.charAt(i);
		
		for(j = 0; j<len2; j++){
			var c2 = word2.charAt(j);
			
			if(c1 == c2){
				dp[i+1][j+1] = dp[i][j];
			}
			else{
				var Creplace = dp[i][j]+1;
				var Cinsert = dp[i][j+1]+1;
				var Cdelete = dp[i+1][j]+1;
				
				Cmin = Math.min(Creplace, Math.min(Cinsert, Cdelete));
				dp[i+1][j+1] = Cmin;
			}
		}
	}
	
	var minLastRow = dp[len1][0];
	for(i = 0; i<=len2; i++){
		minLastRow = Math.min(minLastRow, dp[len1][i]);
	}
	
	return minLastRow;
}

function substringSimilarity(word1, word2) {
	if(word1 == undefined || word2 == undefined){
		return 0.;
	}
	if(word1.length === 0 || word2.length === 0){
		return 0.;
	}
	return 1.-substringEditDistance(word1, word2)/Math.max(word1.length, word2.length);
}

function stringSimilarity(word1, word2) {
	if(word1 == undefined || word2 == undefined){
		return 0.;
	}
	if(word1.length === 0 || word2.length === 0){
		return 0.;
	}
	return 1.-editDistance(word1, word2)/Math.max(word1.length, word2.length);
}

function capitalize(str) {
	if(str == undefined || str.length === 0){
		return "";
	}
	return str.substr(0, 1).toUpperCase()+str.substring(1);
}

var sSimilarity = function (sa1, sa2) {
    // Compare two strings to see how similar they are.
    // Answer is returned as a value from 0 - 1
    // 1 indicates a perfect similarity (100%) while 0 indicates no similarity (0%)
    // Algorithm is set up to closely mimic the mathematical formula from
    // the article describing the algorithm, for clarity. 
    // Algorithm source site: http://www.catalysoft.com/articles/StrikeAMatch.html
    // (Most specifically the slightly cryptic variable names were written as such
    // to mirror the mathematical implementation on the source site)
    //
    // 2014-04-03
    // Found out that the algorithm is an implementation of the S�rensen�Dice coefficient [1]
    // [1] http://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
    //
    // The algorithm is an n-gram comparison of bigrams of characters in a string


    // for my purposes, comparison should not check case or whitespace
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        // I didn't write this.  I'd like to come back sometime
        // and write my own intersection algorithm.  This one seems
        // clean and fast, though.  Going to try to find out where
        // I got it for attribution.  Not sure right now.
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var pairs = function (s) {
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for (var i = 0; i < s.length - 1; i++) {
            pairs[i] = s.slice(i, i + 2);
        }
        return pairs;
    }

    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};