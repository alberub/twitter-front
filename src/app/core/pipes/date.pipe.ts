import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gdate',
  // pure: false
})
export class DatePipe implements PipeTransform {

  transform( messages: any[] ): any {

  if ( messages.length === 0 ) {
    return;
  }

  var last = messages[messages.length-1].createdAt;
  
  const fecha = last;
  const fecha2 = new Date( fecha );
  const actual = Date.now();
  const a = new Date( actual )
  
  const result = calculateMinutes( fecha2, a );

  if (result < 1) {
    last = `Now`;
    return last;
  }
  
  else if ( result >= 1 && result < 60) {
    last = `${ result }m`;
    return last;
  }

  else if( result >= 60 && result <= 1440 ){
    let r = result / 60;
    const sustraction = Math.trunc(r); 
    last = `${ sustraction }h`;
    return last;
  }

  else if( result >= 1440 ){

    last = fecha;
    const midate = new Date( last );
    
    const toTime = midate.getTime();
    const exactHour = new Date( toTime + 21600000);
    
    const arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const getMonth = exactHour.getMonth();

    const day = exactHour.getDate();
    const month = arr[ getMonth ];
    
    last = `${ month } ${ day }`;
    return last;

  }
    
  function calculateMinutes( date1: Date, date2: Date ){
    
    let difference = ( date2.getTime() - date1.getTime()) / 1000;

    difference /= 60;

    return Math.abs(Math.round(difference));

  }

  }

}
