import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk'
})
export class ChunkPipe implements PipeTransform {

  transform(calendarDaysArray: any, chunkSize: number): any {
    let calendarDays = [] as any;
    let weekDays = [] as any;

    calendarDaysArray.map((day: any, index: any) => {
      weekDays.push(day);
      // here we need to use ++ in front of the variable else index increase 
      //will happen after the evaluation but we need it to happen BEFORE
      if (++index % chunkSize === 0) {
        calendarDays.push(weekDays);
        weekDays = [];
      }
    });
    return calendarDays;
  }

}
