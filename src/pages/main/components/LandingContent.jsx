import { useRef } from 'react';
import styled from 'styled-components';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import isPropValid from '@emotion/is-prop-valid';
const LandingContent = ({ ...props }) => {
    const textRef = useRef(null);
    const imgRef = useRef(null);

    useIntersectionObserver(textRef, 'fade-in');
    useIntersectionObserver(imgRef, 'fade-in');

    return (
        <ContentWrapper>
            <Content backImg={props.backImg}>
                <ContentText ref={textRef} textPosition={props.textPosition}>
                    <span>{props.subText}</span>
                    <h2>{props.mainText1}</h2>
                    <h2>{props.mainText2}</h2>
                </ContentText>
                <StyledImage
                    textPosition={props.textPosition}
                    ref={imgRef}
                    src={props.mainImg}
                    alt="메인 이미지"
                    width="320"
                    height="693.66"
                />
            </Content>
        </ContentWrapper>
    );
};

export default LandingContent;

const ContentWrapper = styled.div`
    background: linear-gradient(
        90deg,
        rgba(217, 217, 217, 0) 0%,
        rgba(217, 217, 217, 0.4) 30.73%,
        rgba(217, 217, 217, 0.6) 51.04%,
        rgba(217, 217, 217, 0.4) 71.87%,
        rgba(217, 217, 217, 0) 100%
    );
`;

const Content = styled.div.withConfig({
    shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'backImg',
})`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 160px;
    gap: 58px;
    height: 1200px;
    position: relative;
    background: linear-gradient(180deg, #02000e 9.38%, rgba(2, 0, 14, 0.5) 52.39%, #02000e 100%);

    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
                50% 50% at 50% 50%,
                rgba(2, 0, 14, 0) 0%,
                rgba(2, 0, 14, 0.180099) 37.5%,
                rgba(2, 0, 14, 0.5) 79.5%,
                #02000e 100%
            ),
            url(${({ backImg }) => backImg}) no-repeat center center;
        background-size: cover;
        z-index: -1;
    }

    @media (max-width: 1200px) {
        padding-top: 84px;
        gap: 47px;
        height: 744px;
        width: 744px;
    }

    @media (max-width: 768px) {
        padding-top: 76px;
        gap: 66px;
        width: 375px;
        height: 812px;

        &::before {
            height: 744px;
        }
    }
`;

const ContentText = styled.div.withConfig({
    shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'backImg',
})`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
    span {
        font-size: 16px;
        font-weight: 500;
        color: rgba(210, 192, 48, 1);
        margin-bottom: 8px;
    }

    h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: rgba(255, 255, 255, 1);
    }

    @media (max-width: 1200px) {
        h2 {
            font-size: 20px;
        }
    }
    @media (max-width: 768px) {
        padding: 0px 32px;
        span {
            font-size: 14px;
        }
        align-items: ${({ textPosition }) => textPosition || 'center'};
    }
    opacity: 0;
    transform: ${({ textPosition }) => (textPosition === 'end' ? 'translateX(100px)' : 'translateX(-100px)')};
    transition: opacity 1s ease-out, transform 1s ease-out;
`;

const StyledImage = styled.img.withConfig({
    shouldForwardProp: (prop) => isPropValid(prop) && prop !== 'backImg',
})`
    z-index: 1;
    opacity: 0;
    transform: ${({ textPosition }) => (textPosition === 'end' ? 'translateX(-100px)' : 'translateX(100px)')};
    transition: opacity 1s ease-out, transform 1s ease-out;

    @media (max-width: 1200px) {
        width: 200px;
        height: 433.07px;
    }

    @media (max-width: 768px) {
        width: 240px;
        height: 520.25px;
    }
`;
