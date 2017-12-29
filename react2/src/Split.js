import React from 'react';
import SelectTag from './SelectTag';


const Split = props => (

  //  1 - SPLIT LA PHRASE EN MOTS PUIS REALISE UN MAP SUR CHAQUE MOTS
      
  //  2 - POUR CHAQUE MOTS LE MAP : CRÉER UN TABLEAU CONTEANT LE MOT EN QUESTION ET 
  //      UN ENSEMBLE DE BOUTON RADIO POUR SELECTIONNER LE TAG SOUHAITÉ 
  //      (cf.composant 'SelectTag')

  <ul>
    {
      props.items.toString().split(" ").map((item, index) =>
          
          <table key={index} >

            <tbody>
              <tr>
                
                <td>
                  {item} {/* MOT DE LA PHRASE  */}
                </td>

                <td>

                  {/* AFFICHE LES PROPOSITIONS DE TAG POUR CHAQUE MOT DE LA PHRASE */}
                  <SelectTag />
                  
                  {/* Affiche l'index correspondant à chaque mots de la phrase */}
                  {console.log('index of ' + item + ' is : ' + index)}

                </td>

              </tr>
            </tbody>

          </table>

        )
    }

  </ul>

);



export default Split;