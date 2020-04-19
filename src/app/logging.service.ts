// @Injectable({providedIn: 'root'})
export class LoggingService {
  lastLog: string;

  printLog(log: string): void {
    console.log(`New log: "${log}"`);
    console.log(`Last log: "${this.lastLog}"`);
    this.lastLog = log;
  }
}
