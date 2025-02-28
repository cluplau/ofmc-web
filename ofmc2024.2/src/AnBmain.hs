{-

Open Source Fixedpoint Model-Checker version 2024

(C) Copyright Sebastian Moedersheim 2003,2024
(C) Copyright Jakub Janaszkiewicz 2022
(C) Copyright Paolo Modesti 2012
(C) Copyright Nicklas Bo Jensen 2012
(C) Copyright IBM Corp. 2009
(C) Copyright ETH Zurich (Swiss Federal Institute of Technology) 2003,2007

All Rights Reserved.

-}

module AnBmain(newanbmain) 
where
import AnBParser
import Ast
import Msg
import Lexer
import Translator
import FPTranslator
import AnBOnP

mkIF :: Protocol -> AnBOptsAndPars -> String
mkIF (protocol@(_,typdec,knowledge,_,_,_)) args = 
            ((if (outt args)==IF 
              then (\ x -> x++endstr(noowngoal args)) . ruleList (if2cif args)
              else if ((outt args)==FP) || ((outt args)==FPI) || ((outt args)==Isa)
              then ruleListFP [] True
              else error ("Unknown output format: "++(show (outt args))))  . 
             addInit .
             addGoals . 
             rulesAddSteps . 
             createRules .
             formats ) (mkPTS protocol args)

newanbmain inputstr otp =
  case ctf otp of
  Nothing -> (mkIF (anbparser (alexScanTokens inputstr)) otp)
  Just ctfstring ->
    let parsed_submission = anbparser $ alexScanTokens inputstr
        parsed_ctf = anbparser $ alexScanTokens ctfstring
    in
    if check_compliance parsed_submission parsed_ctf
    then mkIF parsed_submission otp
    else error "Your answer does not comply with the task."
    -- actually the check_compliance should already err with more detail


  
  