import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

beforeEach(() => {
  render(<IletisimFormu/>);
});

test('hata olmadan render ediliyor', () => {
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı


});

test('iletişim formu headerı render ediliyor', () => { 
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const header = screen.getByText(/İletişim Formu/i);
  //Assert
  expect(header).toBeInTheDocument();

});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const isimInput = screen.getByTestId("isimInput");
  userEvent.type(isimInput, 'ekan');
  const isimErrorTest = screen.getAllByTestId("error");
  //Assert
  await waitFor(()=>{
  expect(isimErrorTest).toHaveLength(1);
});
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const buttonSubmit = screen.getByTestId("buttonSubmitTest");
  userEvent.click(buttonSubmit);
  const errors = screen.getAllByTestId("error");
  //Assert
  await waitFor(()=>{
  expect(errors).toHaveLength(3);
});
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const isimInput = screen.getByTestId("isimInput");
  userEvent.type(isimInput, 'Serkan');
  const soyadInput = screen.getByTestId("soyadInput");
  userEvent.type(soyadInput, 'Toraman');
  const buttonSubmit = screen.getByTestId("buttonSubmitTest");
  userEvent.click(buttonSubmit);
  const errors = screen.getAllByTestId("error");
  
  //Assert
  expect(errors).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
   //Arrange
  //  render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, 'Toraman');
  const emailErrorTest = screen.getByTestId("error");
  //Assert
  await waitFor(()=>{
  expect(emailErrorTest).toHaveTextContent("email geçerli bir email adresi olmalıdır.");
});
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
   //Arrange
  //  render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
   //Act
   const isimInput = screen.getByLabelText("Ad*"); //ID'den degil labelTextten aldim
   userEvent.type(isimInput, 'Serkan');
   const emailInput = screen.getByLabelText("Email*");
   userEvent.type(emailInput, 'serkan_toraman@hotmail.com');
   const buttonSubmit = screen.getByTestId("buttonSubmitTest");
    userEvent.click(buttonSubmit);
   const errors = screen.getByTestId("error");//getByAllTestID'deki sorunu sor
   //Assert
   await waitFor(()=>{
   expect(errors).toHaveTextContent("soyad gereklidir.");
   });
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const isimInput = screen.getByTestId("isimInput");
  userEvent.type(isimInput, 'Serkan');
  const soyadInput = screen.getByTestId("soyadInput");
  userEvent.type(soyadInput, 'Toraman');
  const emailInput = screen.getByTestId("emailInput");
  userEvent.type(emailInput, 'serkan_toraman@hotmail.com');
  const buttonSubmit = screen.getByText("Gönder");
  userEvent.click(buttonSubmit);
  const errors = screen.queryAllByTestId("error");
  //Assert
  await waitFor(()=>{
  expect(errors).toHaveLength(0);
});
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
  //Arrange
  // render(<IletisimFormu/>); beforeeach kullanildiğı için gerek kalmadı
  //Act
  const isimInput = screen.getByTestId("isimInput");
  userEvent.type(isimInput, 'Serkan');
  const soyadInput = screen.getByTestId("soyadInput");
  userEvent.type(soyadInput, 'Toraman');
  const emailInput = screen.getByTestId("emailInput");
  userEvent.type(emailInput, 'serkan_toraman@hotmail.com');
  const mesajInput = screen.queryByLabelText("Mesaj");
  userEvent.type(mesajInput, 'mesajyaz');
  const buttonSubmit = screen.getByText("Gönder");
  userEvent.click(buttonSubmit);
  //Assert

  //farkli versiyonlarla test valide edildi(textContent,toHaveTextContent gibi )
  expect(screen.queryByTestId("firstnameDisplay").textContent).toBe("Ad: Serkan");
  expect(screen.queryByTestId("lastnameDisplay")).toHaveTextContent("Soyad: Toraman");
  expect(screen.queryByTestId("emailDisplay")).toBeInTheDocument();
  expect(screen.queryByTestId("messageDisplay").textContent).toBe("Mesaj: mesajyaz");
});
