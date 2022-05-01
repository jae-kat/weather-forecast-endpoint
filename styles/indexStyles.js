import { css } from '@emotion/react';

export const outdoorWorkoutStyles = css`
  width: 70vw;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: auto;
  h1 {
    text-align: center;
    font-style: italic;
    margin: 70px 0 50px;
    grid-column: 1 / span 2;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
    h1 {
      grid-column: 1 / span 3;
    }
  }
  @media screen and (max-width: 700px) {
    width: 90vw;
    grid-template-columns: 1fr;
    h1 {
      grid-column: 1 / span 1;
    }
  }

  .workouts {
    margin: 20px;
    padding: 20px;
    border: 2px solid #fff;
    border-radius: 3px;
    h2 {
      font-size: 1.2rem;
    }
    .date {
      margin-bottom: 2px;
    }
    .city {
      margin-top: 0;
    }
    button {
      border: 2px solid #fe2c2a;
      border-radius: 3px;
      background: #fe2c2a;
      color: #fff;
      padding: 12px 20px;
      font-weight: 500;
      letter-spacing: 1px;
      :hover {
        background: transparent;
      }
    }
  }

  .forecast {
    position: fixed;
    top: 25vh;
    left: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: #fff0e1;
    color: #22202b;
    border-radius: 3px;
    padding: 40px;
    min-width: 400px;
    button {
      margin-left: auto;
      border: 2px solid #fe2c2a;
      border-radius: 3px;
      background: transparent;
      color: #fe2c2a;
      padding: 4px 6px;
      font-weight: 500;
      letter-spacing: 1px;
    }
    @media screen and (max-width: 700px) {
      min-width: 80vw;
      left: 10vw;
    }
    @media screen and (min-width: 1000px) {
      left: 35vw;
    }

    .city {
      margin: 0;
      font-size: smaller;
    }
    .date {
      margin-top: 2px;
      font-weight: 700;
      span {
        font-weight: initial;
      }
    }
    .description {
      font-style: italic;
      margin-top: 0;
    }
    .temp {
      span {
        display: inline-block;
        :first-of-type {
          margin: 12px 40px 0;
        }
        :nth-of-type(2) {
          margin: 0 40px 0;
        }
      }
    }
  }
`;
