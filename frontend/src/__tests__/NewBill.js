
/**
 * @jest-environment jsdom
 */


import { screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
//ajout de :
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
//import Logout from "../containers/Logout.js";

import mockStore from "../__mocks__/store";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import BillsUI from "../views/BillsUI.js";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);



describe("I am an employee and I create a new bill", () => {
    beforeEach(() => {
        // R�initialisation du local storage
        window.localStorage.clear();
        // Suppression du contenu du body
        document.body.innerHTML = "";
    });

    //Comportement attendu lorsque l'utilisateur remplit le formulaire de cr�ation d'une nouvelle note de frais avec des donn�es valides et qu'il clique sur le bouton de validation

    test("Then it should create a new bill when all is correct  ", () => {
        // Mock du local storage pour simuler qu'on est connect�
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
        });
        window.localStorage.setItem(
            "user",
            JSON.stringify({
                type: "Employee",
                email: "e-mail@test.fr",
            })
        );
        // Simuler le chargement de la page NewBill avec la fonction NewBillUI
        document.body.innerHTML = NewBillUI();

        // Cr�er un mock de la fonction onNavigate pour v�rifier qu'elle est bien appel�e
        const mockOnNavigate = jest.fn();

        // Cr�er un mock de NewBill
        const newBill = new NewBill({
            document,
            onNavigate: mockOnNavigate,
            store: mockStore,
            localStorage: window.localStorage,
        });

        // Simuler la saisie des champs obligatoires
        fireEvent.change(screen.getByTestId("expense-type"), {
            target: { value: "Transports" },
        });
        fireEvent.change(screen.getByTestId("expense-name"), {
            target: { value: "test" },
        });
        fireEvent.change(screen.getByTestId("datepicker"), {
            target: { value: "2023-04-11" },
        });
        fireEvent.change(screen.getByTestId("amount"), {
            target: { value: "20" },
        });
        fireEvent.change(screen.getByTestId("vat"), {
            target: { value: "10" },
        });
        fireEvent.change(screen.getByTestId("pct"), {
            target: { value: "20" },
        });
        fireEvent.change(screen.getByTestId("commentary"), {
            target: { value: "" },
        });
        // Simuler l'upload d'un fichier avec une extension valide
        const file = new File(["file.jpg"], "file.jpg", {
            type: "image/jpeg",
        });
        const fileField = screen.getByTestId("file");
        userEvent.upload(fileField, file);

        // Cr�er un mock de la fonction handleSubmit pour v�rifier qu'elle est bien appel�e
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

        // R�cup�rer le formulaire et ajouter un event listener sur le submit pour appeler la fonction handleSubmit
        const form = screen.getByTestId("form-new-bill");
        form.addEventListener("submit", handleSubmit);

        // Submit du formulaire
        fireEvent.submit(form);

        // On s'attend � ce que la fonction handleSubmit soit appel�e
        expect(handleSubmit).toHaveBeenCalled();

        // On s'attend � ce que la fonction onNavigate soit appel�e avec la bonne route
        expect(mockOnNavigate).toHaveBeenCalledWith(ROUTES_PATH["Bills"]);
    });

    // Comportement attendu lorsque l'utilisateur essaye de cr�er une note de frais avec un fichier ayant une extension invalide
    test("Then it should not create a new bill when the file is wrong ext", () => {
        // Mock du local storage pour simuler qu'on est connect� en tant qu'employ�
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
        });
        window.localStorage.setItem(
            "user",
            JSON.stringify({
                type: "Employee",
                email: "mail@test.fr",
            })
        );

        // On ajoute un div root
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        // On charge le router pour naviguer ensuite
        router();

        // On se place sur la page de cr�ation d'une note de frais
        window.onNavigate(ROUTES_PATH.NewBill);

        // On cr�e un fichier avec une extension invalide
        const fileWithInvalidExt = new File(["file.invalid"], "file.invalid", {
            type: "image/gif",
        });

        // On cr�e un mock pour v�rifier que la fonction d'alerte est bien appel�e
        const alerting = jest.spyOn(window, "alert").mockImplementation(() => { });

        // On r�cup�re le champ de fichier et on d�clenche l'upload
        const fileField = screen.getByTestId("file");
        userEvent.upload(fileField, fileWithInvalidExt);

        // On v�rifie que l'alerte est bien appel�e avec le message appropri�
        expect(alerting).toBeCalledWith(
            "Veuillez choisir un fichier ayant une extension jpg, jpeg ou png."
        );

        // On v�rifie que le champ est bien vide (puisque pas le bon format)
        expect(fileField.value).toBe("");
    });
});


//test pour v�rifier que si les champs obligatoires ne sont pas remplis, le formulaire n'est pas soumis et un message d'erreur s'affiche

describe("When I am on NewBill Page and I submit the form with empty fields", () => {
    test("Then, it should not create a new bill and an error message should be displayed", () => {
        // Mock du local storage pour simuler qu'on est connect� en tant qu'employ�
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

        // On ajoute un div root
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.append(root);
        // On charge le router pour naviguer ensuite
        router();

        // On se place sur la page de cr�ation d'une note de frais
        window.onNavigate(ROUTES_PATH.NewBill);

        // Simuler la saisie des champs obligatoires
        fireEvent.change(screen.getByTestId("expense-type"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByTestId("expense-name"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByTestId("datepicker"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByTestId("amount"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByTestId("vat"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByTestId("pct"), {
            target: { value: "" },
        });
        fireEvent.change(screen.getByTestId("commentary"), {
            target: { value: "" },
        });

        // On cr�e un mock pour v�rifier que la fonction d'alerte est bien appel�e
        const alerting = jest.spyOn(window, "alert").mockImplementation(() => { });

        // On r�cup�re le formulaire et on le soumet
        const form = screen.getByTestId("form-new-bill");
        fireEvent.submit(form);

        // On v�rifie que l'alerte est bien appel�e avec le message automatique de validation des champs
        expect(alerting).toHaveBeenCalled();
    });
});

describe("When an error occurs on API", () => {
    beforeEach(() => {
        // R�initialisation du local storage
        jest.spyOn(mockStore, "bills");
        // d�finir le contenu du local storage pour simuler qu'on est connect�
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
        // Ajouter un div avec l'id root pour y ajouter le contenu de la page
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        // Charger le router
        router();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
        // retourne une erreur 500 si la fonction list est appel�e gr�ce au mock de bills dans le store
        mockStore.bills.mockImplementationOnce(() => {
            return {
                list: () => {
                    return Promise.reject(new Error("Erreur 500"));
                },
            };
        });
        // Naviguer vers la page Bills
        window.onNavigate(ROUTES_PATH.NewBill);
        // Attendre que la promesse soit rejet�e
        await new Promise(process.nextTick);
        // Afficher le message d'erreur dans le document body
        document.body.innerHTML = BillsUI({ error: "Erreur 500" });
        // d�clarer une variable "message" qui r�cup�re le message d'erreur
        const message = screen.getByText(/Erreur 500/);
        // s'attend � ce que le message soit affich�
        expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
            return {
                list: () => {
                    return Promise.reject(new Error("Erreur 404"));
                },
            };
        });
        window.onNavigate(ROUTES_PATH.NewBill);
        await new Promise(process.nextTick);
        document.body.innerHTML = BillsUI({ error: "Erreur 404" });
        const message = screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
    });
});

describe("Given I submit the new bill", () => {
    test("Then the bill is added", async () => {
        // Mock du local storage pour simuler qu'on est connect� en tant qu'employ�
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
        });
        window.localStorage.setItem(
            "user",
            JSON.stringify({
                type: "Employee",
                email: "azerty@email.com",
            })
        );
        // Simuler le chargement de la page NewBill avec la fonction NewBillUI
        document.body.innerHTML = NewBillUI();

        const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname });
        };

        // creer un mock de NewBill
        const newBill = new NewBill({
            document,
            onNavigate,
            store: null,
            localStorage: window.localStorage,
        });
        // simuler une facture valide
        const validityBill = {
            type: "transport",
            name: "test",
            date: "2023-05-01",
            amount: 200,
            vat: 20,
            pct: 10,
            commentary: "test",
            fileUrl: "/test.jpg",
            fileName: "test.jpg",
            status: "pending",
        };

        // Charger les valeurs dans les champs de la facture valide
        screen.getByTestId("expense-type").value = validityBill.type;
        screen.getByTestId("expense-name").value = validityBill.name;
        screen.getByTestId("datepicker").value = validityBill.date;
        screen.getByTestId("amount").value = validityBill.amount;
        screen.getByTestId("vat").value = validityBill.vat;
        screen.getByTestId("pct").value = validityBill.pct;
        screen.getByTestId("commentary").value = validityBill.commentary;

        newBill.fileName = validityBill.fileName;
        newBill.fileUrl = validityBill.fileUrl;
        // simuler le click sur le bouton submit et l'envoi du formulaire
        newBill.updateBill = jest.fn();
        const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

        // R�cup�rer le formulaire et ajouter un event listener sur le submit pour appeler la fonction handleSubmit
        const form = screen.getByTestId("form-new-bill");
        form.addEventListener("submit", handleSubmit);
        fireEvent.submit(form);
        // On s'attend � ce que la fonction handleSubmit soit appel�e et la fonction updateBill
        expect(handleSubmit).toHaveBeenCalled();
        expect(newBill.updateBill).toHaveBeenCalled();
        // on s'attend � ce que le statut de la facture soit "pending"
        expect(validityBill.status).toBe("pending");
    });
});




