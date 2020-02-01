export default{
	
	timestampToDate(timetamp){
		if(timetamp =='0' || timetamp==0) return ''; 
		var d=new Date(timetamp); 
		return formatDate(d);
	}
}

function formatDate(now) { 
     var year=now.getFullYear(); 
     var month=now.getMonth()+1; 
     var date=now.getDate(); 
     var hour=now.getHours(); 
     var minute=now.getMinutes(); 
     var second=now.getSeconds(); 
     return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
} 