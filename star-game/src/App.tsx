import './App.css';
import React from "react";
import './image/portfolio.png';



interface PlayNumberProps {
  playNum: number;
  numStatus: string;
  onClick: (number: number, currentStatus: string) => void;
  isGameDone: boolean;
}

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const PlayNumber: React.FC<PlayNumberProps> = ({ playNum, numStatus, onClick, isGameDone }) => {
  return (
    <span>
      <button 
        className='number'
        style={{ backgroundColor: colors[numStatus as keyof typeof colors] }}
        onClick={()=> onClick(playNum, numStatus)}
        disabled={isGameDone}
      >
        {playNum}
      </button>
    </span>
  )
}

const PlayAgain: React.FC<{onClick: () => void, isWin:any, isGameDone:any}> = ({onClick, isWin, isGameDone}) => {
  return(
    <div className='gameDone'>
      <div className='resultMessage'>
        {isWin && isGameDone ? (
          <p className='isWin'>You Win !!!</p>
        ):(
          <p className='isWin'>You Lose</p>
        )} 
      </div>
      <button onClick={onClick}>Play Again</button>
    </div>
  )
}

class App extends React.Component<any,any> {
  constructor(props:any){
    super(props);
    this.state = {
      starNum: this.getRandomNum(1, 9),
      clickNum: 9,
      availableNums: [1,2,3,4,5,6,7,8,9],
      candidateNums: [],
      isGameDone: false,
      secondLeft: 10,
      isWin: false
    }
  }
  
  timerID: NodeJS.Timeout | null = null;
  timer = () => {
    if (this.state.secondLeft > 0){
      this.setState({ secondLeft: this.state.secondLeft-1})
    } else{
      this.setState({ isGameDone: true })
      if(this.timerID){
        clearInterval(this.timerID);
        this.timerID = null;
      }
    }
  }
  
  componentDidMount(): void {
    this.timerID = setInterval(() => this.timer(), 1000);
  }

  componentWillUnmount(): void {
      if(this.timerID){
        clearInterval(this.timerID);
        this.timerID = null;
      }
  }

  checkWin = () => {
    if(this.state.availableNums.length === 0) {
      this.setState({ isGameDone: true, isWin: true });
      if(this.timerID){
        clearInterval(this.timerID);
        this.timerID = null;
      }
    }
  }

  resetGame = () => {
    window.location.reload();
  }

  starRandomSum = () => {
    const { availableNums } = this.state;
    let sum = 0;
    const tempAvailableNums = [...availableNums]
    if(tempAvailableNums.length === 0) {
      this.setState({ isGameDone: true });
      return null;
    }
    if(availableNums.length > 0){
      while (sum <= 9 && tempAvailableNums.length > 0) {
        const randomIndex = Math.floor(Math.random() * tempAvailableNums.length);
        console.log("randomIndex: ", randomIndex)
        
        const randomNum = tempAvailableNums[randomIndex];
        console.log("randomNum", randomNum);
        if (sum+randomNum <= 9){
          sum += randomNum;
          tempAvailableNums.splice(randomIndex,1);
          console.log("sum:", sum);
          console.log("tempAvailableNums", tempAvailableNums);
        }
        else break;
      }
      console.log("sum after", sum);
      this.setState({ starNum: sum });
    }
    return null;
  }

  onNumberClick = (number: number, currentStatus: string) => {
    const {availableNums, candidateNums, starNum} = this.state;
    if (!availableNums.includes(number)){
      return;
    }
    
    //is number is available, can either be added or removed to candidate
    const newCandidateNums = 
      currentStatus === 'available'? 
        candidateNums.concat(number)
        :
        candidateNums.filter((cn:any) => cn!== number);
        ;
    if (this.sum(newCandidateNums) !== starNum){
      this.setState({ candidateNums: newCandidateNums })
    } else{
      this.setState((prevState: any) => {
        //all candidateNum are removed from availableNums
        const updateAvailableNums = prevState.availableNums.filter(
          (num: number) => !newCandidateNums.includes(num)
        );
        return {
          candidateNums: newCandidateNums,
          availableNums: updateAvailableNums
        }
      },
      () => 
      {
        // add a delay to allow the UI to update
        setTimeout(() => {
          this.starRandomSum();
          this.setState({ candidateNums: []});
          this.checkWin();
        }, 100);
      }
      );
    }
  }

  numberStatus = (curNum: number) => {
    const curAvaNum = this.state.availableNums;
    const curCandNum = this.state.candidateNums;
    if (!curAvaNum.includes(curNum)){
      return 'used';
    }
    if (curCandNum.includes(curNum)){
      return this.candidateWrong() ? 'wrong' : 'candidate';
    }
    return 'available'
  }

  candidateWrong = () => {
    return this.sum(this.state.candidateNums) > this.state.starNum;
  }

  sum(arr: number[]): number{
    //acc: accumulator, curr: curremt
    //reduce method provide accumulated result
    return arr.reduce((acc,curr) => acc+ curr, 0) 
  }

  starRange(min: number, max: number): number[] {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }

  getRandomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max-min+1))+min;
  }

  render() {
    const { starNum, clickNum, secondLeft, isGameDone, isWin } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <p>Pick 1 or more numbers that sum to the number of stars</p>
          <div className='gameBody'>
            <div className='left'>
              {isGameDone ? (
                <PlayAgain 
                  onClick={this.resetGame}
                  isWin={isWin}
                  isGameDone={isGameDone}
                />
              ) : (
                <div className='grid'>
                  {this.starRange(1, starNum).map((index)=>(
                    <span
                      key={index}
                    >
                      <div className='star'>
                        &#9733;
                      </div>
                    </span>
                  ))}
                </div>
              )
            }

            </div>
            <div className='right'>
              <div className='grid'>
                {this.starRange(1, clickNum).map((index)=>(
                  <PlayNumber 
                    key={index} 
                    playNum={index}
                    numStatus={this.numberStatus(index)}
                    onClick={this.onNumberClick}
                    isGameDone={isGameDone}
                    />
                ))}
              </div>
            </div>
          </div>
          <p className='timer'>Time Remaining: {secondLeft}</p>

        </div>
        <footer>
          <div className="footer-text">
            Designed with &#10084; by Mengzhu Ou 
          </div>
          <div className="footer-find-me">
            <a href="https://mengzhuou.github.io/">Find Me</a>
          </div>
        </footer>
    </div>
    );
  }
}

export default App;