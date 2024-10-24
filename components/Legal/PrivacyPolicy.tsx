import React, { useState } from "react";
import {
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Button,
  Modal,
  View,
} from "react-native";
import { colors } from "../../utils/colors";

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View>
      <Text style={styles.linkText} onPress={() => setIsVisible(true)}>
        Privatlivs Politik
      </Text>
      <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)}>
        <ScrollView style={styles.container}>
          <Button
            title={"Tilbage"}
            onPress={() => setIsVisible(false)}
            color={colors.blue}
          />
          <Text style={styles.header}>
            Oplysninger om vores behandling af dine personoplysninger mv.
          </Text>

          <Text style={styles.subheader}>
            1. Vi er den dataansvarlige – hvordan kontakter du os?
          </Text>
          <Text style={styles.text}>
            Girafs Venner er dataansvarlig for behandlingen af de
            personoplysninger, som vi har modtaget om dig. Du finder vores
            kontaktoplysninger nedenfor.
          </Text>
          <Text style={styles.text}>Navn: Girafs Venner</Text>
          <Text style={styles.text}>Telefon: 99 40 78 38</Text>
          <Text style={styles.text}>CVR-nr.: 40519025</Text>
          <Text style={styles.text}>Mail: nbha@cs.aau.dk</Text>

          <Text style={styles.subheader}>
            2. Formålene med og retsgrundlaget for behandlingen af dine
            personoplysninger
          </Text>
          <Text style={styles.text}>
            Vi behandler dine personoplysninger til følgende formål:
          </Text>
          <Text style={styles.text}>
            - Tilvejebringe et kommunikationsværktøj til autistiske børn og
            institutionens medarbejdere.
          </Text>
          <Text style={styles.text}>
            - Skabe en personaliseret interaktion mellem systemet og barnet via
            en systembruger.
          </Text>
          <Text style={styles.text}>
            Vores behandling sker på baggrund af interesseafvejningsreglen i
            databeskyttelsesforordningens artikel 6, stk. 1, litra f, med det
            formål at hjælpe autistiske børn med at kommunikere.
          </Text>

          <Text style={styles.subheader}>
            3. Kategorier af personoplysninger
          </Text>
          <Text style={styles.text}>
            Vi behandler følgende kategorier af personoplysninger:
          </Text>
          <Text style={styles.text}>- Identifikationsoplysninger</Text>
          <Text style={styles.text}>- Almindelige personoplysninger</Text>

          <Text style={styles.subheader}>
            4. Hvor dine personoplysninger stammer fra
          </Text>
          <Text style={styles.text}>
            Personoplysningerne stammer fra registreringen af brugeren i
            applikationen.
          </Text>

          <Text style={styles.subheader}>
            5. Opbevaring af dine personoplysninger
          </Text>
          <Text style={styles.text}>
            Personlige oplysninger slettes 1 år efter, at brugeren er erklæret
            inaktiv.
          </Text>

          <Text style={styles.subheader}>
            6. Retten til at trække samtykke tilbage
          </Text>
          <Text style={styles.text}>
            Du har til enhver tid ret til at trække dit samtykke tilbage ved at
            kontakte os. Tilbagetrækning påvirker ikke lovligheden af tidligere
            behandling.
          </Text>

          <Text style={styles.subheader}>7. Dine rettigheder</Text>
          <Text style={styles.text}>
            Du har en række rettigheder ifølge databeskyttelsesforordningen:
          </Text>
          <Text style={styles.text}>
            - Ret til at se oplysninger (indsigtsret)
          </Text>
          <Text style={styles.text}>- Ret til berigtigelse (rettelse)</Text>
          <Text style={styles.text}>- Ret til sletning</Text>
          <Text style={styles.text}>- Ret til begrænsning af behandling</Text>
          <Text style={styles.text}>- Ret til indsigelse</Text>
          <Text style={styles.text}>- Ret til dataportabilitet</Text>
          <TouchableOpacity
            onPress={() => handleLinkPress("https://www.datatilsynet.dk")}
          >
            <Text style={styles.link}>
              Læs mere om dine rettigheder på Datatilsynet
            </Text>
          </TouchableOpacity>

          <Text style={styles.subheader}>8. Klage til Datatilsynet</Text>
          <Text style={styles.text}>
            Du har ret til at indgive en klage til Datatilsynet, hvis du er
            utilfreds med vores behandling af dine personoplysninger.
          </Text>
          <TouchableOpacity
            onPress={() => handleLinkPress("https://www.datatilsynet.dk")}
          >
            <Text style={styles.link}>Kontakt Datatilsynet</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.black,
  },
  subheader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.black,
  },
  text: {
    marginBottom: 10,
    fontSize: 16,
    color: colors.black,
  },
  link: {
    color: colors.blue,
    marginBottom: 20,
  },
  linkText: {
    color: colors.blue,
    textDecorationLine: "underline",
  },
});

export default PrivacyPolicy;
