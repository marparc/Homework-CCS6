drop database if exists `HomeWork`;
create database `HomeWork`;
use `HomeWork`;

create table sysadm (
	AdminID int not null,
    FullName varchar(50) not null,
    primary key (AdminID)
);

create table user_table (
	UserID int not null,
    FirstName varchar(20) not null,
    LastName varchar(30) not null,
    ContactNumber varchar(11) not null,
    BirthDate date not null,
    UserType varchar(7) not null,
    primary key (UserID)
);

create table user_account (
	AccountID int not null,
    Account_Name varchar(50) not null,
    Account_Status varchar(8) not null,
    Account_Password varchar(30) not null,
    Bio varchar(50) not null,
    UserID int not null,
    primary key (AccountID),
    foreign key (UserID) references user_table(UserID)
);

create table student (
	StudentID int not null,
	EducationLevel varchar(11) not null,
    Degree varchar(30) not null,
    CurrentSchool varchar(30) not null,
    YearLevel varchar(15) not null,
    BankName varchar(15) not null,
    AccountNumber varchar(15) not null,
    UserID int not null,
    primary key (StudentID),
    foreign key (UserID) references user_table(UserID)
);

create table portfolio (
	PortfolioID int not null,
    PortfolioName varchar(30) not null,
    PortfolioDesc varchar(150) not null,
    Link varchar(150) not null,
    StudentID int not null,
    primary key (PortfolioID),
    foreign key (StudentID) references student(StudentID)
);

create table client_table (
	ClientID int not null,
    Client_Organization varchar(30),
    UserID int not null,
    primary key (ClientID),
    foreign key (UserID) references user_table(UserID)
);

create table services (
	ServiceID int not null,
    ServiceDesc varchar(150) not null,
    Price decimal(6,2) not null,
    StudentID int not null,
    primary key (ServiceID),
    foreign key (StudentID) references student(StudentID)
);

create table service_request (
	RequestID int not null,
    RequestStatus varchar(8) not null,
    ClientID int not null,
    ServiceID int not null,
    primary key (RequestID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (ServiceID) references services(ServiceID)
);

create table job_listing (
	JobID int not null,
    JobTitle varchar(50) not null,
    JobDescription varchar(150) not null,
    JobPay decimal(6,2) not null,
    JobType varchar(6) not null,
    LocationLat decimal(8,6),
    LocationLong decimal(9,6),
    DueDate date not null,
    DatePosted date not null,
    JobStatus varchar(11) not null,
    ClientID int not null,
    RequestID int,
    primary key (JobID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (RequestID) references service_request(RequestID)
);

create table application (
	ApplicationID int not null,
    ApplicationMessage varchar(150) not null,
    ApplicationStatus varchar(8) not null,
    StudentID int not null,
    JobID int not null,
    primary key (ApplicationID),
    foreign key (StudentID) references student(StudentID),
    foreign key (JobID) references job_listing(JobID)
);

create table chat (
	ChatID int not null,
    ClientID int not null,
    StudentID int not null,
    primary key (ChatID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (StudentID) references student(StudentID)
);

create table message_logs (
	LogID int not null,
    TimeSent timestamp not null,
    MessageContent varchar(150) not null,
    ChatID int not null,
    ClientID int,
    StudentID int,
    primary key (LogID),
    foreign key (ChatID) references chat(ChatID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (StudentID) references student(StudentID)
);

create table stud_evaluation (
	StudentEvalID int not null,
    Rating int not null,
    UserComment varchar(150) not null,
    ClientID int not null,
    StudentID int not null,
    primary key (StudentEvalID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (StudentID) references student(StudentID)
);

create table client_evaluation (
	ClientEvalID int not null,
    Rating int not null,
    UserComment varchar(150) not null,
    ClientID int not null,
    StudentID int not null,
    primary key (ClientEvalID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (StudentID) references student(StudentID)
);

create table payment (
	PaymentID int not null,
	Receipt varchar(20) not null,
	ClientID int not null,
    StudentID int not null,
    primary key (PaymentID),
    foreign key (ClientID) references client_table(ClientID),
    foreign key (StudentID) references student(StudentID)
);