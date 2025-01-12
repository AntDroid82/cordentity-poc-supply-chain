import React from 'react';
import Slider from 'react-slick';
import CloseBtnPNG from '../../../assets/img/close-btn.svg';
import BackBtnPNG from '../../../assets/img/back-btn-2.svg';
import ForwardBtnPNG from '../../../assets/img/forward-btn.svg';
import AppScreenshotPNG from '../../../assets/img/mobile-screenshot@3x.png';
import Steps from '../Steps/Steps';
import 'slick-carousel/slick/slick.scss';
import './CollectPackageModal.scss';
import QRCode from 'qrcode.react';
import classSet from 'react-classset';
import {getInvite} from "../../../state/async";


export default class CollectPackageModal extends React.Component {
    state = {
        step: 0,
        active: true,
    };

    slider = React.createRef();

    componentDidMount() {
        getInvite();
        setTimeout(() => this.setState({active: false}), 100)
    }

    render() {
        const steps = [
            {
                header: 'Verification',
                subheader: 'Check if patient has the proof'
            },
            {
                header: 'QR scanning',
                subheader: 'Help patient to scan QR'
            }
        ];

        const {onClose} = this.props;
        const {step, active} = this.state;

        const step0Classes = classSet({
            info: true,
            'step-0': true,
            fade: true,
            active,
        });

        const step1Classes = classSet({
            info: true,
            'step-1': true,
            fade: true,
            active,
        });

        const {invite} = this.props;

        const slider = <Slider ref={c => (this.slider = c)} speed={200} slidesToShow={1} slidesToScroll={1}
                               arrows={false}>
            <div className={step0Classes}>
                <img src={AppScreenshotPNG} className='app-screenshot' data-rjs="3" alt="App screenshot"/>
                <div className="instructions">
                    <p>1. Ask patient to run the app</p>
                    <p>2. Verify if patient has a proof to collect this package</p>
                </div>
            </div>
            <div className={step1Classes}>
                {invite && <QRCode value={JSON.stringify(invite)} size={250} level='H'/>}
                <div className="instructions">
                    <p>Ask patient to scan this QR code in order to confirm the request.</p>
                    <p>After successful proof patient is able to collect package.</p>
                </div>
            </div>
        </Slider>;

        return (
            <div className="modal">
                <div className="header">
                    <h5>Collect package</h5>
                    <img src={CloseBtnPNG} className='close-btn' onClick={onClose} alt="Close"/>
                </div>
                <div className="body">
                    <div className="content">
                        <Steps currentStep={step} onStepChange={this.handleStepChange} steps={steps}/>
                        {slider}
                    </div>
                    {step === 1
                        ? <div className="controls">
                            <button onClick={this.handleBack} className='cancel-btn'>
                                <span className="img" style={{backgroundImage: `url(${BackBtnPNG})`}}/> Back
                            </button>
                            <button onClick={this.handleNext(steps.length)} className='next-btn'>
                                Finish
                            </button>
                        </div>
                        : <div className="controls one">
                            <button onClick={this.handleNext(steps.length)} className='next-btn'>
                                Proceed <span className="img" style={{backgroundImage: `url(${ForwardBtnPNG})`}}/>
                            </button>
                        </div>
                    }
                </div>
            </div>
        )
    }

    handleBack = () => {
        const {step} = this.state;
        const {onClose} = this.props;

        if (step > 0) {
            this.slider.slickGoTo(step - 1);
            this.setState({step: step - 1});
        } else
            onClose();
    };

    handleNext = maxSteps => () => {
        const {step} = this.state;
        const {onClose} = this.props;

        if (step < maxSteps - 1) {
            this.slider.slickGoTo(step + 1);
            this.setState({step: step + 1});
        } else
            onClose();
    };

    handleStepChange = stepIndex => {
        this.setState({step: stepIndex});
        this.slider.slickGoTo(stepIndex);
    };
}
