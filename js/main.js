

document.topButtonsAutoClicks = 0;
document.answerButtonsAutoClicks = 0;

$(document).ready(function(){
    var currentQuestion,
        questions = [],
        moneyWin = null;
    function AppViewModel() {
        var n = 1000,
            moneyArray = [1000, 500, 250, 125, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.3, 0.2, 0.1],
            categories = [],
            count = moneyArray.length,
            self = this;
        self.currentStep = ko.observable();
        self.currentStepFormat = ko.observable();
        self.goToStep = function (n) {
            self.currentStep(n);
            self.currentStepFormat(count - n + 1);
        };
        self.currentQuestion = ko.observable();
        self.goToStep(15);

        startGame();

        this.sendAnswer = function (answer) {
            if (document.answerButtonsAutoClicks < 4) {
                document.answerButtonsAutoClicks++;
            }else{
                $("#answer" + answer).addClass('selectedAnswer');
                setTimeout(function () {
                    var correct = getCorrectAnswer();
                    $("#answer" + correct).addClass('correctAnswer');
                    if (isCorrectAnswer(answer)) {
                        if(categories[self.currentStep() - 1].nSum) {
                            moneyWin = categories[self.currentStep() - 1].money;
                        }
                        $("#answer" + answer).removeClass('selectedAnswer');
                        setTimeout(function () {
                            $("#answer" + getCorrectAnswer()).removeClass('correctAnswer');
                            nextStep();
                            currentQuestion = getRandomQuestion();
                            if (self.currentStep()==0) {
                                showMessage('You Win! Total money: '+moneyWin, true);
                                startGame();
                            }
                        }, 1000);
                    } else {
                        if(moneyWin){
                            showMessage('Game Over! Your Total money: '+moneyWin, true);
                        }else{
                            showMessage('Game Over', false);
                        }
                        setTimeout(function () {
                            $("#answer" + answer).removeClass('selectedAnswer');
                            $("#answer" + correct).removeClass('correctAnswer');
                            startGame();
                        }, 1000);
                    }
                }, 1000);
            }
        };

        this.sendTips = function (tips) {
            if (document.topButtonsAutoClicks < 3) {
                document.topButtonsAutoClicks++;
            }else{
                var b = $("#"+tips);
                if(!b.hasClass("used")) {
                    b.addClass("used");
                    switch (tips) {
                        case 'half':
                            console.log('50:50');
                            break;
                        case 'helpHall':
                            console.log('Помощь зала');
                            break;
                        case 'call':
                            console.log('Звонок другу');
                            break;
                    }
                }
            }
        };

        function startGame() {
            self.goToStep(15);
            initCategories();
        }


        function nextStep() {
            self.goToStep(self.currentStep()-1);
        }

        function getRandomQuestion() {
            if(self.currentStep()-1 >= 0) {
                var arrayOfQuestions = questions[self.currentStep() - 1];
                self.currentQuestion(arrayOfQuestions[randomIntFromInterval(0, arrayOfQuestions.length - 1)]);
            }else{
                self.currentQuestion({
                    title: '',
                    answers: {
                        A: '',
                        B: '',
                        C: '',
                        D: ''
                    },
                    correct: ''
                });
            }
            return self.currentQuestion();
        }

        function initCategories() {
            questions = [];
            categories = [];
            for(var i = 0; i < count; i++){
                var id = (count-i);
                var questions_block = [];
                for(var j=1;j<=3;j++){
                    questions_block.push({
                        title: 'Question '+id+'.'+j+' ?',
                        answers: {
                            A: 'Answer 1',
                            B: 'Answer 2',
                            C: 'Answer 3',
                            D: 'Answer 4'
                        },
                        correct: 'A'
                    });
                }
                questions.push(questions_block);
                categories.push({
                    id : id,
                    money : converMoney(moneyArray[i]*n),
                    nSum: [1000,32,1].indexOf(moneyArray[i]) != -1
                });
            }

            self.moneyArray = ko.observableArray(categories);
            currentQuestion = getRandomQuestion();
        }
    }

    function getCorrectAnswer() {
        return currentQuestion.correct;
    }

    function isCorrectAnswer(answer) {
        return currentQuestion.correct == answer;
    }

    function converMoney(money){
        return '$'+money.toFixed(0).replace(/./g, function(c, i, a) {
            return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        });
    }

    function showMessage(text,success) {
        var message = $("#message-window");
        if(success){
            message.addClass('success');
        }else{
            message.removeClass('success');
        }
        message.find("span").text(text);
        message.animate({
            opacity: 1,
            top: 100
        },700, function () {
            setTimeout(function () {
                message.animate({
                    opacity: 0,
                    top: -100
                },700);
            },2000);
        });
    }

    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    ko.applyBindings(new AppViewModel());

});