export default () => (
  <div>
    <style jsx global>{`
      body {
        font-family: "Raleway", sans-serif;
        color: #333;
        line-height: 1.4;
        background: #fdfdfd;
      }

      .mm-big-message {
        text-align: center;
        padding: 20px;
        font-size: 16px;
        color: #0f3846;
      }

      select {
        background: #fff;
        border: 1px solid #b7b7b7;
        border-radius: 3px;
        padding: 3px 22px 3px 3px;
        background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7.406 7.828l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z'%3E%3C/path%3E%3C/svg%3E");
        background-position: calc(100% - 3px) 50%;
        background-repeat: no-repeat;
        background-size: 16px;
        -webkit-appearance: none;
        -moz-appearance: none;
      }

      select::-ms-expand {
        display: none;
      }

      .mm-content-padding {
        padding: 0px 20px;
      }

      .mm-all-padding {
        padding: 20px;
      }

      .join-title {
        text-align: center;
        margin: 40px 0 10px;
        font-size: 16px;
      }

      .room-input {
        padding: 10px;
        font-size: 16px;
        text-align: center;
        border: 1px solid #b7b7b7;
        width: 170px;
        box-sizing: border-box;
        text-transform: uppercase;
      }

      .join-btn {
        margin-top: 10px;
      }

      .mm-btn {
        display: inline-block;
        padding: 10px;
        border: 1px solid #ffc818;
        border-radius: 6px;
        text-decoration: none;
        color: #333;
        font-size: 14px;
        cursor: pointer;
        background: #ffc818;
        width: 170px;
        box-sizing: border-box;
        line-height: 1;
        outline: none;
      }

      .options-container {
        padding: 0 20px;
        text-align: center;
      }

      strong {
        font-weight: bold;
      }
    `}</style>
  </div>
);
