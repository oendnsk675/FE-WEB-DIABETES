$(document).ready(function() {
    // let base_url = 'http://127.0.0.1:5000'
    let base_url = 'https://osyicozy.pythonanywhere.com/'
    let dataDefault = {
        "glucose":0,
        "blood-pressure":0,
        "skin-thickness":0,
        "insulin":0,
        "bmi":0,
        "diabetes-pedigree-function":0,
        "age":0
    }
    
    function render(){
        if (localStorage.getItem("data") === null) {
            localStorage.setItem('data', JSON.stringify(dataDefault))
            $("#info-card-param").html(dataDefault.glucose)
        }else{
            let data = getData()
            $("#info-card-param").html(data.glucose)
        }
        
        if(localStorage.getItem("status_diabet") === null){
            localStorage.setItem('status_diabet', 'Belum Check')
        }
        $("#status-diabet").html(localStorage.getItem('status_diabet'))
    }

    // $('canvas')[0].css('height', '100px')

    // console.log();

    render()
    let containerParam = $("#container-btn-param")[0].children
    for (const item of containerParam) {
        $(item).click(() => {
            let state = $(item).attr('data-param')
            let data = getData()
            resetStateBtn()
            $(item).addClass('border')
            if (state == 'btn-toggle-g') {
                $("#header-card-info").html('Glukosa')
                $("#info-card-param").html(data.glucose)
            }else if(state == 'btn-toggle-bp'){
                $("#header-card-info").html('Blood Pressure')
                $("#info-card-param").html(data['blood-pressure'])
            }else if(state == 'btn-toggle-st'){
                $("#header-card-info").html('Skin Thickness')
                $("#info-card-param").html(data['skin-thickness'])
            }else if(state == 'btn-toggle-insulin'){
                $("#header-card-info").html('Insulin')
                $("#info-card-param").html(data['insulin'])
            }else if(state == 'btn-toggle-bmi'){
                $("#header-card-info").html('BMI')
                $("#info-card-param").html(data['bmi'])
            }else if(state == 'btn-toggle-dpf'){
                $("#header-card-info").html('DPF')
                $("#info-card-param").html(data['diabetes-pedigree-function'])
            }else if(state == 'btn-toggle-age'){
                $("#header-card-info").html('Age')
                $("#info-card-param").html(data['age'])
            }else{
                $("#info-card-param").html('...')
            }
        })
    }

    
    function resetStateBtn() {
        for (const item of containerParam){
            $(item).removeClass('border')
        }
    }

    $("#setting-parameter").click(async function() {
        const { value: formValues } = await Swal.fire({
            title: 'Setting Parameter',
            html:
                `
                <div class="flex gap-2">
                    <div class="w-[48%]">
                        <input id="glucose" placeholder="glucose" class="swal2-input">
                        <input id="blood-pressure" placeholder="blood-pressure" class="swal2-input">
                        <input id="skin-thickness" placeholder="skin-thickness" class="swal2-input">
                        <input id="insulin" placeholder="insulin" class="swal2-input">
                    </div>
                    <div class="w-[48%]">
                        <input id="bmi" placeholder="bmi" class="swal2-input">
                        <input id="diabetes-pedigree-function" placeholder="diabetes-pedigree-function" class="swal2-input">
                        <input id="age" placeholder="age" class="swal2-input">
                    </div>
                </div>
                `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    'glucose': document.getElementById('glucose').value,
                    'blood-pressure': document.getElementById('blood-pressure').value,
                    'skin-thickness': document.getElementById('skin-thickness').value,
                    'insulin': document.getElementById('insulin').value,
                    'bmi': document.getElementById('bmi').value,
                    'diabetes-pedigree-function': document.getElementById('diabetes-pedigree-function').value,
                    'age': document.getElementById('age').value,
                }
            }
        })
    
        if (formValues) {
            let data = update(JSON.stringify(formValues))
            localStorage.setItem('data', JSON.stringify(data))
            render()
        }
    })
    
    function getData(){
        return JSON.parse(localStorage.getItem('data'))
    }
    
    function update(data) {
        let dataOld = getData()
        let dataNew = JSON.parse(data)
    
    
        Object.keys(dataNew).forEach(k => {
            if (dataNew[k] != "") {
                dataOld[k] = dataNew[k]
            }
        });
    
        return dataOld
    
    }  

    $("#btn-check").click(function() {
        // console.log();

        let svgLoading = `<svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>`

        $("#btn-check").html(svgLoading)
        $("#btn-check").attr('disabled', true)
        
        var settings = {
            "url": `${base_url}/api/analysis`,
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify(getData()),
        };
          
        $.ajax(settings).done(function ({data}) {
            // console.log(data);
            if (data == 'yes') {
                $("#status-diabet").html('Positive Diabetes')
                localStorage.setItem('status_diabet', 'Positive Diabetes')
            }else{
                $("#status-diabet").html('Negative Diabetes')
                localStorage.setItem('status_diabet', 'Negative Diabetes')
            }
            $("#btn-check").attr('disabled', false)
            $("#btn-check").html('Check')
            // addHit()
            // loader(false)
        });
    })
})