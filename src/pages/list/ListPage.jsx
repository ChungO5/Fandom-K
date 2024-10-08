import CreditStatus from './components/CreditStatus';
import ThisMonthChart from './components/ThisMonthChart';
import DonationList from './components/DonationList';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from '../../components/ErrorPage';

const ListPage = () => {
    return (
        <ErrorBoundary FallbackComponent={ErrorPage}>
            <Container>
                <CreditStatus />
                <DonationList />
                <ThisMonthChart />
            </Container>
        </ErrorBoundary>
    );
};

export default ListPage;

const Container = styled.div`
    margin: 50px 0 0;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
`;
