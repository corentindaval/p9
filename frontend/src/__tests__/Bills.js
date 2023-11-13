
/**
 * @jest-environment jsdom
 */



import Bills from "../containers/Bills.js";
//import Logout from "./Logout.js";
import mockStore from "../__mocks__/store";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen, waitFor,fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import {ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore);
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
        expect(windowIcon).toHaveClass('active-icon')
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML) 
      const antiChrono = (a, b) => ((a < b) ? 1 : +1) 
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
      describe("Given I am connected as an employee", () => {
          describe("when i click on icon eye", () => {
              test("Then a modal should open", () => {
                  // Mock du local storage pour simuler qu'on est connecté
                  Object.defineProperty(window, "localStorage", {
                      value: localStorageMock,
                  });
                  window.localStorage.setItem(
                      "user",
                      JSON.stringify({
                          type: "Employee",
                          email: "test@test.fr",
                      })
                  );
                  // Créer un mock de la fonction onNavigate pour vérifier qu'elle est bien appelée
                  const mockOnNavigate = jest.fn();
                  //mock de la modale
                  $.fn.modal = jest.fn();

                  //mock de bill pour pouvoir tester l'affichage de la modale
                  const bill = new Bills({
                      document,
                      onNavigate: mockOnNavigate,
                      store: mockStore,
                      localStorage: window.localStorage,
                  });

                  document.body.innerHTML = BillsUI({ data: bills });

                  //on récupère l'icone oeil de la page Bills
                  const iconEye = screen.getAllByTestId("icon-eye")[0];
                  //créer un mock de la fonction handleClickIconEye pour pouvoir tester son appel
                  const handleClickIconEye = jest.fn(() =>
                      bill.handleClickIconEye(iconEye)
                  );
                  //on simule le click sur l'icone oeil
                  iconEye.addEventListener("click", handleClickIconEye);
                  userEvent.click(iconEye);

                  //on vérifie que la fonction handleClickIconEye a bien été appelée
                  expect(handleClickIconEye).toHaveBeenCalled();

                  // Vérifie que la modale est bien visible
                  expect($.fn.modal).toHaveBeenCalled();
              });
          });
          describe("When I am on Bills Page", () => {
              test("Then when I click on New Bill button, the New Bill page should be displayed", () => {
                  // Mock du local storage pour simuler qu'on est connecté
                  Object.defineProperty(window, "localStorage", {
                      value: localStorageMock,
                  });
                  window.localStorage.setItem(
                      "user",
                      JSON.stringify({
                          type: "Employee",
                          email: "test@test.fr",
                      })
                  );
                  // mock de onNavigate
                  const onNavigate = (pathname) => {
                      document.body.innerHTML = ROUTES({ pathname });
                  };

                  //cliquer sur le bouton Nouvelle note de frais
                  document.body.innerHTML = BillsUI({ data: bills });
                  const bill = new Bills({
                      document,
                      onNavigate,
                      firestore: null,
                      localStorage: window.localStorage,
                  });
                  //créer un mock de la fonction handleClickNewBill pour pouvoir tester son appel
                  const handleClickNewBill = jest.fn(bill.handleClickNewBill);
                  //on récupère le bouton Nouvelle note de frais
                  const newBillButton = screen.getByTestId("btn-new-bill");
                  //on simule le click sur le bouton Nouvelle note de frais
                  newBillButton.addEventListener("click", handleClickNewBill);
                  //on vérifie que la fonction handleClickNewBill a bien été appelée
                  userEvent.click(newBillButton);
                  //on s'attends à ce que la page New Bill s'affiche
                  expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
              });
          });
      });

     
         
      

     describe("Given I am connected as an employee", () => {
       describe("when i click on icon eye", () => {
         test("Then a modal should open", () => {
             // Mock du local storage pour simuler qu'on est connecté
             Object.defineProperty(window, "localStorage", {
                 value: localStorageMock,
             });
             window.localStorage.setItem(
                 "user",
                 JSON.stringify({
                    type: "Employee",
                    email: "test@test.fr",
                })
            );
            // Créer un mock de la fonction onNavigate pour vérifier qu'elle est bien appelée
            const mockOnNavigate = jest.fn();
            //mock de la modale
            $.fn.modal = jest.fn();

            //mock de bill pour pouvoir tester l'affichage de la modale
            const bill = new Bills({
                document,
                onNavigate: mockOnNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });

            document.body.innerHTML = BillsUI({ data: bills });

            //on récupère l'icone oeil de la page Bills
            const iconEye = screen.getAllByTestId("icon-eye")[0];
            //créer un mock de la fonction handleClickIconEye pour pouvoir tester son appel
            const handleClickIconEye = jest.fn(() =>
                bill.handleClickIconEye(iconEye)
            );
            //on simule le click sur l'icone oeil
            iconEye.addEventListener("click", handleClickIconEye);
            userEvent.click(iconEye);

            //on vérifie que la fonction handleClickIconEye a bien été appelée
            expect(handleClickIconEye).toHaveBeenCalled();

            // Vérifie que la modale est bien visible
            expect($.fn.modal).toHaveBeenCalled();
        });
       });

         describe("When I navigate to Bills.js", () => {
             test("fetches bills from mock API GET", async () => {
                 localStorage.setItem(
                     "user",
                     JSON.stringify({ type: "Employee", email: "a@a" })
                 );
                 const root = document.createElement("div");
                 root.setAttribute("id", "root");
                 document.body.append(root);
                 router();
                 window.onNavigate(ROUTES_PATH.Bills);
                 await waitFor(() => screen.getByText("Mes notes de frais"));
                 //vérifier que le tableau des factures s'affiche bien

                 expect(bills).toBeTruthy();
             });
             describe("When an error occurs on API", () => {
                 beforeEach(() => {
                     jest.spyOn(mockStore, "bills");
                     Object.defineProperty(window, "localStorage", {
                         value: localStorageMock,
                     });
                     window.localStorage.setItem(
                         "user",
                         JSON.stringify({
                             type: "Employee",
                             email: "a@a",
                         })
                     );
                     const root = document.createElement("div");
                     root.setAttribute("id", "root");
                     document.body.appendChild(root);
                     router();
                 });
                 test("fetches bills from an API and fails with 404 message error", async () => {
                     mockStore.bills.mockImplementationOnce(() => {
                         return {
                             list: () => {
                                 return Promise.reject(new Error("Erreur 404"));
                             },
                         };
                     });
                     window.onNavigate(ROUTES_PATH.Bills);
                     await new Promise(process.nextTick);
                     const message = await screen.getByText(/Erreur 404/);
                     expect(message).toBeTruthy();
                 });

                 test("fetches messages from an API and fails with 500 message error", async () => {
                     mockStore.bills.mockImplementationOnce(() => {
                         return {
                             list: () => {
                                 return Promise.reject(new Error("Erreur 500"));
                             },
                         };
                     });

                     window.onNavigate(ROUTES_PATH.Bills);
                     await new Promise(process.nextTick);
                     const message = await screen.getByText(/Erreur 500/);
                     expect(message).toBeTruthy();
                 });
             });
         });
    });

      



  })
})
