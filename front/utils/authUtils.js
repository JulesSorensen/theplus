import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Décodage du token JWT en utilisant la méthode Base64
 * @returns {Promise<string|null>} - Le pseudo de l'utilisateur ou null si non trouvé.
 */
export const getPseudoFromToken = async () => {
  try {
    // Récupérer le JWT stocké
    const token = await AsyncStorage.getItem('jwt');
    if (token) {
      // Extraire le payload en découpant le token JWT
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        // Décoder le payload en Base64
        const decodedPayload = JSON.parse(atob(payloadBase64));
        // Renvoyer le pseudo ou le nom d'utilisateur depuis le payload
        return decodedPayload?.pseudo || decodedPayload?.name || null;
      }
    }
    console.warn("Aucun token trouvé.");
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération du pseudo :", error);
    return null;
  }
};

export const getUser = async () => {
  const token = await AsyncStorage.getItem('jwt');
  if (token) {
    const payloadBase64 = token.split('.')[1];
    if (payloadBase64) {
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload
    }
  }
}

