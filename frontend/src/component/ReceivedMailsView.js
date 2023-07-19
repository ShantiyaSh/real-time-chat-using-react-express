const ReceivedMailView = (props) => {
  const title = <div class="section_title">Received Mails</div>;
  const Mails = props.receivedMails.sort((x, y) => {return  y.created_at - x.created_at})
  Mails.map(mail => mail.created_at =new Date(mail.created_at))
  const view = Mails.map(({ id, senderId, text , created_at }) => (
    <div class="mail" key={id}>
      <div class="mail_dis">From:{senderId}</div>
      <div class="mail_text">
        Message:<span>{text}</span>
      </div>
      <div class="mail_date">{created_at.toLocaleDateString()}  {created_at.toLocaleTimeString()}</div>
    </div>
  ));
  return (
    <div>
      {title}
      <div class="mail_container">{view}</div>
    </div>
  );
};
export default ReceivedMailView;
