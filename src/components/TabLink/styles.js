import styled from 'styled-components';

export const Button = styled.a`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px 50px;
  cursor: pointer;
  align-items: center;

  svg {
    font-size: 2rem;
  }

  :hover {
    background-color: white;
  }

  border-left: ${({ selected }) => selected && '5px solid #cc3444'};
  background-color: ${({ selected }) => selected && 'white'};
`;
