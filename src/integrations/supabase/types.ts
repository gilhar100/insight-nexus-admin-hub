export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      colleague_survey_responses: {
        Row: {
          "1": number | null
          "10": number | null
          "11": number | null
          "12": number | null
          "13": number | null
          "14": number | null
          "15": number | null
          "16": number | null
          "17": number | null
          "18": number | null
          "19": number | null
          "2": number | null
          "20": number | null
          "21": number | null
          "22": number | null
          "23": number | null
          "24": number | null
          "25": number | null
          "26": number | null
          "27": number | null
          "28": number | null
          "29": number | null
          "3": number | null
          "30": number | null
          "31": number | null
          "32": number | null
          "33": number | null
          "34": number | null
          "35": number | null
          "36": number | null
          "37": number | null
          "38": number | null
          "39": number | null
          "4": number | null
          "40": number | null
          "41": number | null
          "42": number | null
          "43": number | null
          "44": number | null
          "45": number | null
          "46": number | null
          "47": number | null
          "48": number | null
          "49": number | null
          "5": number | null
          "50": number | null
          "51": number | null
          "52": number | null
          "53": number | null
          "54": number | null
          "55": number | null
          "56": number | null
          "57": number | null
          "58": number | null
          "59": number | null
          "6": number | null
          "60": number | null
          "61": number | null
          "62": number | null
          "63": number | null
          "64": number | null
          "65": number | null
          "66": number | null
          "67": number | null
          "68": number | null
          "69": number | null
          "7": number | null
          "70": number | null
          "71": number | null
          "72": number | null
          "73": number | null
          "74": number | null
          "75": number | null
          "76": number | null
          "77": number | null
          "78": number | null
          "79": number | null
          "8": number | null
          "80": number | null
          "81": number | null
          "82": number | null
          "83": number | null
          "84": number | null
          "85": number | null
          "86": number | null
          "87": number | null
          "88": number | null
          "89": number | null
          "9": number | null
          "90": number | null
          answers: number[] | null
          consent_for_research: boolean | null
          created_at: string
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s: number
          evaluator_department: string | null
          evaluator_email: string | null
          evaluator_name: string | null
          evaluator_position: string | null
          id: string
          is_anonymous: boolean | null
          manager_department: string | null
          manager_name: string
          manager_position: string | null
          organization: string | null
          slq_score: number
        }
        Insert: {
          "1"?: number | null
          "10"?: number | null
          "11"?: number | null
          "12"?: number | null
          "13"?: number | null
          "14"?: number | null
          "15"?: number | null
          "16"?: number | null
          "17"?: number | null
          "18"?: number | null
          "19"?: number | null
          "2"?: number | null
          "20"?: number | null
          "21"?: number | null
          "22"?: number | null
          "23"?: number | null
          "24"?: number | null
          "25"?: number | null
          "26"?: number | null
          "27"?: number | null
          "28"?: number | null
          "29"?: number | null
          "3"?: number | null
          "30"?: number | null
          "31"?: number | null
          "32"?: number | null
          "33"?: number | null
          "34"?: number | null
          "35"?: number | null
          "36"?: number | null
          "37"?: number | null
          "38"?: number | null
          "39"?: number | null
          "4"?: number | null
          "40"?: number | null
          "41"?: number | null
          "42"?: number | null
          "43"?: number | null
          "44"?: number | null
          "45"?: number | null
          "46"?: number | null
          "47"?: number | null
          "48"?: number | null
          "49"?: number | null
          "5"?: number | null
          "50"?: number | null
          "51"?: number | null
          "52"?: number | null
          "53"?: number | null
          "54"?: number | null
          "55"?: number | null
          "56"?: number | null
          "57"?: number | null
          "58"?: number | null
          "59"?: number | null
          "6"?: number | null
          "60"?: number | null
          "61"?: number | null
          "62"?: number | null
          "63"?: number | null
          "64"?: number | null
          "65"?: number | null
          "66"?: number | null
          "67"?: number | null
          "68"?: number | null
          "69"?: number | null
          "7"?: number | null
          "70"?: number | null
          "71"?: number | null
          "72"?: number | null
          "73"?: number | null
          "74"?: number | null
          "75"?: number | null
          "76"?: number | null
          "77"?: number | null
          "78"?: number | null
          "79"?: number | null
          "8"?: number | null
          "80"?: number | null
          "81"?: number | null
          "82"?: number | null
          "83"?: number | null
          "84"?: number | null
          "85"?: number | null
          "86"?: number | null
          "87"?: number | null
          "88"?: number | null
          "89"?: number | null
          "9"?: number | null
          "90"?: number | null
          answers?: number[] | null
          consent_for_research?: boolean | null
          created_at?: string
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s: number
          evaluator_department?: string | null
          evaluator_email?: string | null
          evaluator_name?: string | null
          evaluator_position?: string | null
          id?: string
          is_anonymous?: boolean | null
          manager_department?: string | null
          manager_name: string
          manager_position?: string | null
          organization?: string | null
          slq_score: number
        }
        Update: {
          "1"?: number | null
          "10"?: number | null
          "11"?: number | null
          "12"?: number | null
          "13"?: number | null
          "14"?: number | null
          "15"?: number | null
          "16"?: number | null
          "17"?: number | null
          "18"?: number | null
          "19"?: number | null
          "2"?: number | null
          "20"?: number | null
          "21"?: number | null
          "22"?: number | null
          "23"?: number | null
          "24"?: number | null
          "25"?: number | null
          "26"?: number | null
          "27"?: number | null
          "28"?: number | null
          "29"?: number | null
          "3"?: number | null
          "30"?: number | null
          "31"?: number | null
          "32"?: number | null
          "33"?: number | null
          "34"?: number | null
          "35"?: number | null
          "36"?: number | null
          "37"?: number | null
          "38"?: number | null
          "39"?: number | null
          "4"?: number | null
          "40"?: number | null
          "41"?: number | null
          "42"?: number | null
          "43"?: number | null
          "44"?: number | null
          "45"?: number | null
          "46"?: number | null
          "47"?: number | null
          "48"?: number | null
          "49"?: number | null
          "5"?: number | null
          "50"?: number | null
          "51"?: number | null
          "52"?: number | null
          "53"?: number | null
          "54"?: number | null
          "55"?: number | null
          "56"?: number | null
          "57"?: number | null
          "58"?: number | null
          "59"?: number | null
          "6"?: number | null
          "60"?: number | null
          "61"?: number | null
          "62"?: number | null
          "63"?: number | null
          "64"?: number | null
          "65"?: number | null
          "66"?: number | null
          "67"?: number | null
          "68"?: number | null
          "69"?: number | null
          "7"?: number | null
          "70"?: number | null
          "71"?: number | null
          "72"?: number | null
          "73"?: number | null
          "74"?: number | null
          "75"?: number | null
          "76"?: number | null
          "77"?: number | null
          "78"?: number | null
          "79"?: number | null
          "8"?: number | null
          "80"?: number | null
          "81"?: number | null
          "82"?: number | null
          "83"?: number | null
          "84"?: number | null
          "85"?: number | null
          "86"?: number | null
          "87"?: number | null
          "88"?: number | null
          "89"?: number | null
          "9"?: number | null
          "90"?: number | null
          answers?: number[] | null
          consent_for_research?: boolean | null
          created_at?: string
          dimension_a?: number
          dimension_a2?: number
          dimension_i?: number
          dimension_l?: number
          dimension_m?: number
          dimension_s?: number
          evaluator_department?: string | null
          evaluator_email?: string | null
          evaluator_name?: string | null
          evaluator_position?: string | null
          id?: string
          is_anonymous?: boolean | null
          manager_department?: string | null
          manager_name?: string
          manager_position?: string | null
          organization?: string | null
          slq_score?: number
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          "1": number | null
          "10": number | null
          "11": number | null
          "12": number | null
          "13": number | null
          "14": number | null
          "15": number | null
          "16": number | null
          "17": number | null
          "18": number | null
          "19": number | null
          "2": number | null
          "20": number | null
          "21": number | null
          "22": number | null
          "23": number | null
          "24": number | null
          "25": number | null
          "26": number | null
          "27": number | null
          "28": number | null
          "29": number | null
          "3": number | null
          "30": number | null
          "31": number | null
          "32": number | null
          "33": number | null
          "34": number | null
          "35": number | null
          "36": number | null
          "37": number | null
          "38": number | null
          "39": number | null
          "4": number | null
          "40": number | null
          "41": number | null
          "42": number | null
          "43": number | null
          "44": number | null
          "45": number | null
          "46": number | null
          "47": number | null
          "48": number | null
          "49": number | null
          "5": number | null
          "50": number | null
          "51": number | null
          "52": number | null
          "53": number | null
          "54": number | null
          "55": number | null
          "56": number | null
          "57": number | null
          "58": number | null
          "59": number | null
          "6": number | null
          "60": number | null
          "61": number | null
          "62": number | null
          "63": number | null
          "64": number | null
          "65": number | null
          "66": number | null
          "67": number | null
          "68": number | null
          "69": number | null
          "7": number | null
          "70": number | null
          "71": number | null
          "72": number | null
          "73": number | null
          "74": number | null
          "75": number | null
          "76": number | null
          "77": number | null
          "78": number | null
          "79": number | null
          "8": number | null
          "80": number | null
          "81": number | null
          "82": number | null
          "83": number | null
          "84": number | null
          "85": number | null
          "86": number | null
          "87": number | null
          "88": number | null
          "89": number | null
          "9": number | null
          "90": number | null
          answers: number[] | null
          consent_for_research: boolean | null
          created_at: string
          department: string | null
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s: number
          id: string
          is_anonymous: boolean | null
          organization: string | null
          position: string | null
          slq_score: number
          strategy: number
          survey_type: string
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          "1"?: number | null
          "10"?: number | null
          "11"?: number | null
          "12"?: number | null
          "13"?: number | null
          "14"?: number | null
          "15"?: number | null
          "16"?: number | null
          "17"?: number | null
          "18"?: number | null
          "19"?: number | null
          "2"?: number | null
          "20"?: number | null
          "21"?: number | null
          "22"?: number | null
          "23"?: number | null
          "24"?: number | null
          "25"?: number | null
          "26"?: number | null
          "27"?: number | null
          "28"?: number | null
          "29"?: number | null
          "3"?: number | null
          "30"?: number | null
          "31"?: number | null
          "32"?: number | null
          "33"?: number | null
          "34"?: number | null
          "35"?: number | null
          "36"?: number | null
          "37"?: number | null
          "38"?: number | null
          "39"?: number | null
          "4"?: number | null
          "40"?: number | null
          "41"?: number | null
          "42"?: number | null
          "43"?: number | null
          "44"?: number | null
          "45"?: number | null
          "46"?: number | null
          "47"?: number | null
          "48"?: number | null
          "49"?: number | null
          "5"?: number | null
          "50"?: number | null
          "51"?: number | null
          "52"?: number | null
          "53"?: number | null
          "54"?: number | null
          "55"?: number | null
          "56"?: number | null
          "57"?: number | null
          "58"?: number | null
          "59"?: number | null
          "6"?: number | null
          "60"?: number | null
          "61"?: number | null
          "62"?: number | null
          "63"?: number | null
          "64"?: number | null
          "65"?: number | null
          "66"?: number | null
          "67"?: number | null
          "68"?: number | null
          "69"?: number | null
          "7"?: number | null
          "70"?: number | null
          "71"?: number | null
          "72"?: number | null
          "73"?: number | null
          "74"?: number | null
          "75"?: number | null
          "76"?: number | null
          "77"?: number | null
          "78"?: number | null
          "79"?: number | null
          "8"?: number | null
          "80"?: number | null
          "81"?: number | null
          "82"?: number | null
          "83"?: number | null
          "84"?: number | null
          "85"?: number | null
          "86"?: number | null
          "87"?: number | null
          "88"?: number | null
          "89"?: number | null
          "9"?: number | null
          "90"?: number | null
          answers?: number[] | null
          consent_for_research?: boolean | null
          created_at?: string
          department?: string | null
          dimension_a: number
          dimension_a2: number
          dimension_i: number
          dimension_l: number
          dimension_m: number
          dimension_s?: number
          id?: string
          is_anonymous?: boolean | null
          organization?: string | null
          position?: string | null
          slq_score: number
          strategy: number
          survey_type?: string
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          "1"?: number | null
          "10"?: number | null
          "11"?: number | null
          "12"?: number | null
          "13"?: number | null
          "14"?: number | null
          "15"?: number | null
          "16"?: number | null
          "17"?: number | null
          "18"?: number | null
          "19"?: number | null
          "2"?: number | null
          "20"?: number | null
          "21"?: number | null
          "22"?: number | null
          "23"?: number | null
          "24"?: number | null
          "25"?: number | null
          "26"?: number | null
          "27"?: number | null
          "28"?: number | null
          "29"?: number | null
          "3"?: number | null
          "30"?: number | null
          "31"?: number | null
          "32"?: number | null
          "33"?: number | null
          "34"?: number | null
          "35"?: number | null
          "36"?: number | null
          "37"?: number | null
          "38"?: number | null
          "39"?: number | null
          "4"?: number | null
          "40"?: number | null
          "41"?: number | null
          "42"?: number | null
          "43"?: number | null
          "44"?: number | null
          "45"?: number | null
          "46"?: number | null
          "47"?: number | null
          "48"?: number | null
          "49"?: number | null
          "5"?: number | null
          "50"?: number | null
          "51"?: number | null
          "52"?: number | null
          "53"?: number | null
          "54"?: number | null
          "55"?: number | null
          "56"?: number | null
          "57"?: number | null
          "58"?: number | null
          "59"?: number | null
          "6"?: number | null
          "60"?: number | null
          "61"?: number | null
          "62"?: number | null
          "63"?: number | null
          "64"?: number | null
          "65"?: number | null
          "66"?: number | null
          "67"?: number | null
          "68"?: number | null
          "69"?: number | null
          "7"?: number | null
          "70"?: number | null
          "71"?: number | null
          "72"?: number | null
          "73"?: number | null
          "74"?: number | null
          "75"?: number | null
          "76"?: number | null
          "77"?: number | null
          "78"?: number | null
          "79"?: number | null
          "8"?: number | null
          "80"?: number | null
          "81"?: number | null
          "82"?: number | null
          "83"?: number | null
          "84"?: number | null
          "85"?: number | null
          "86"?: number | null
          "87"?: number | null
          "88"?: number | null
          "89"?: number | null
          "9"?: number | null
          "90"?: number | null
          answers?: number[] | null
          consent_for_research?: boolean | null
          created_at?: string
          department?: string | null
          dimension_a?: number
          dimension_a2?: number
          dimension_i?: number
          dimension_l?: number
          dimension_m?: number
          dimension_s?: number
          id?: string
          is_anonymous?: boolean | null
          organization?: string | null
          position?: string | null
          slq_score?: number
          strategy?: number
          survey_type?: string
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      woca_responses: {
        Row: {
          "1": number | null
          "10": number | null
          "11": number | null
          "12": number | null
          "13": number | null
          "14": number | null
          "15": number | null
          "16": number | null
          "17": number | null
          "18": number | null
          "19": number | null
          "2": number | null
          "20": number | null
          "21": number | null
          "22": number | null
          "23": number | null
          "24": number | null
          "25": number | null
          "26": number | null
          "27": number | null
          "28": number | null
          "29": number | null
          "3": number | null
          "30": number | null
          "31": number | null
          "32": number | null
          "33": number | null
          "34": number | null
          "35": number | null
          "36": number | null
          "37": number | null
          "38": number | null
          "39": number | null
          "4": number | null
          "40": number | null
          "41": number | null
          "42": number | null
          "43": number | null
          "44": number | null
          "45": number | null
          "46": number | null
          "47": number | null
          "48": number | null
          "49": number | null
          "5": number | null
          "50": number | null
          "51": number | null
          "52": number | null
          "53": number | null
          "54": number | null
          "55": number | null
          "56": number | null
          "57": number | null
          "58": number | null
          "59": number | null
          "6": number | null
          "60": number | null
          "61": number | null
          "62": number | null
          "63": number | null
          "64": number | null
          "65": number | null
          "66": number | null
          "67": number | null
          "68": number | null
          "69": number | null
          "7": number | null
          "70": number | null
          "71": number | null
          "72": number | null
          "73": number | null
          "74": number | null
          "75": number | null
          "76": number | null
          "77": number | null
          "78": number | null
          "79": number | null
          "8": number | null
          "80": number | null
          "81": number | null
          "82": number | null
          "83": number | null
          "84": number | null
          "85": number | null
          "86": number | null
          "87": number | null
          "88": number | null
          "89": number | null
          "9": number | null
          "90": number | null
          age: string | null
          answers: number[] | null
          consent_research: boolean | null
          created_at: string | null
          education: string | null
          email: string
          experience_years: number | null
          full_name: string
          gender: string | null
          group_id: string | null
          id: string
          organization: string | null
          overall_score: number | null
          phone: string | null
          profession: string | null
          q1: number | null
          q10: number | null
          q11: number | null
          q12: number | null
          q13: number | null
          q14: number | null
          q15: number | null
          q16: number | null
          q17: number | null
          q18: number | null
          q19: number | null
          q2: number | null
          q20: number | null
          q21: number | null
          q22: number | null
          q23: number | null
          q24: number | null
          q25: number | null
          q26: number | null
          q27: number | null
          q28: number | null
          q29: number | null
          q3: number | null
          q30: number | null
          q31: number | null
          q32: number | null
          q33: number | null
          q34: number | null
          q35: number | null
          q36: number | null
          q4: number | null
          q5: number | null
          q6: number | null
          q7: number | null
          q8: number | null
          q9: number | null
          question_responses: Json | null
          workshop_id: number | null
        }
        Insert: {
          "1"?: number | null
          "10"?: number | null
          "11"?: number | null
          "12"?: number | null
          "13"?: number | null
          "14"?: number | null
          "15"?: number | null
          "16"?: number | null
          "17"?: number | null
          "18"?: number | null
          "19"?: number | null
          "2"?: number | null
          "20"?: number | null
          "21"?: number | null
          "22"?: number | null
          "23"?: number | null
          "24"?: number | null
          "25"?: number | null
          "26"?: number | null
          "27"?: number | null
          "28"?: number | null
          "29"?: number | null
          "3"?: number | null
          "30"?: number | null
          "31"?: number | null
          "32"?: number | null
          "33"?: number | null
          "34"?: number | null
          "35"?: number | null
          "36"?: number | null
          "37"?: number | null
          "38"?: number | null
          "39"?: number | null
          "4"?: number | null
          "40"?: number | null
          "41"?: number | null
          "42"?: number | null
          "43"?: number | null
          "44"?: number | null
          "45"?: number | null
          "46"?: number | null
          "47"?: number | null
          "48"?: number | null
          "49"?: number | null
          "5"?: number | null
          "50"?: number | null
          "51"?: number | null
          "52"?: number | null
          "53"?: number | null
          "54"?: number | null
          "55"?: number | null
          "56"?: number | null
          "57"?: number | null
          "58"?: number | null
          "59"?: number | null
          "6"?: number | null
          "60"?: number | null
          "61"?: number | null
          "62"?: number | null
          "63"?: number | null
          "64"?: number | null
          "65"?: number | null
          "66"?: number | null
          "67"?: number | null
          "68"?: number | null
          "69"?: number | null
          "7"?: number | null
          "70"?: number | null
          "71"?: number | null
          "72"?: number | null
          "73"?: number | null
          "74"?: number | null
          "75"?: number | null
          "76"?: number | null
          "77"?: number | null
          "78"?: number | null
          "79"?: number | null
          "8"?: number | null
          "80"?: number | null
          "81"?: number | null
          "82"?: number | null
          "83"?: number | null
          "84"?: number | null
          "85"?: number | null
          "86"?: number | null
          "87"?: number | null
          "88"?: number | null
          "89"?: number | null
          "9"?: number | null
          "90"?: number | null
          age?: string | null
          answers?: number[] | null
          consent_research?: boolean | null
          created_at?: string | null
          education?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          gender?: string | null
          group_id?: string | null
          id: string
          organization?: string | null
          overall_score?: number | null
          phone?: string | null
          profession?: string | null
          q1?: number | null
          q10?: number | null
          q11?: number | null
          q12?: number | null
          q13?: number | null
          q14?: number | null
          q15?: number | null
          q16?: number | null
          q17?: number | null
          q18?: number | null
          q19?: number | null
          q2?: number | null
          q20?: number | null
          q21?: number | null
          q22?: number | null
          q23?: number | null
          q24?: number | null
          q25?: number | null
          q26?: number | null
          q27?: number | null
          q28?: number | null
          q29?: number | null
          q3?: number | null
          q30?: number | null
          q31?: number | null
          q32?: number | null
          q33?: number | null
          q34?: number | null
          q35?: number | null
          q36?: number | null
          q4?: number | null
          q5?: number | null
          q6?: number | null
          q7?: number | null
          q8?: number | null
          q9?: number | null
          question_responses?: Json | null
          workshop_id?: number | null
        }
        Update: {
          "1"?: number | null
          "10"?: number | null
          "11"?: number | null
          "12"?: number | null
          "13"?: number | null
          "14"?: number | null
          "15"?: number | null
          "16"?: number | null
          "17"?: number | null
          "18"?: number | null
          "19"?: number | null
          "2"?: number | null
          "20"?: number | null
          "21"?: number | null
          "22"?: number | null
          "23"?: number | null
          "24"?: number | null
          "25"?: number | null
          "26"?: number | null
          "27"?: number | null
          "28"?: number | null
          "29"?: number | null
          "3"?: number | null
          "30"?: number | null
          "31"?: number | null
          "32"?: number | null
          "33"?: number | null
          "34"?: number | null
          "35"?: number | null
          "36"?: number | null
          "37"?: number | null
          "38"?: number | null
          "39"?: number | null
          "4"?: number | null
          "40"?: number | null
          "41"?: number | null
          "42"?: number | null
          "43"?: number | null
          "44"?: number | null
          "45"?: number | null
          "46"?: number | null
          "47"?: number | null
          "48"?: number | null
          "49"?: number | null
          "5"?: number | null
          "50"?: number | null
          "51"?: number | null
          "52"?: number | null
          "53"?: number | null
          "54"?: number | null
          "55"?: number | null
          "56"?: number | null
          "57"?: number | null
          "58"?: number | null
          "59"?: number | null
          "6"?: number | null
          "60"?: number | null
          "61"?: number | null
          "62"?: number | null
          "63"?: number | null
          "64"?: number | null
          "65"?: number | null
          "66"?: number | null
          "67"?: number | null
          "68"?: number | null
          "69"?: number | null
          "7"?: number | null
          "70"?: number | null
          "71"?: number | null
          "72"?: number | null
          "73"?: number | null
          "74"?: number | null
          "75"?: number | null
          "76"?: number | null
          "77"?: number | null
          "78"?: number | null
          "79"?: number | null
          "8"?: number | null
          "80"?: number | null
          "81"?: number | null
          "82"?: number | null
          "83"?: number | null
          "84"?: number | null
          "85"?: number | null
          "86"?: number | null
          "87"?: number | null
          "88"?: number | null
          "89"?: number | null
          "9"?: number | null
          "90"?: number | null
          age?: string | null
          answers?: number[] | null
          consent_research?: boolean | null
          created_at?: string | null
          education?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          gender?: string | null
          group_id?: string | null
          id?: string
          organization?: string | null
          overall_score?: number | null
          phone?: string | null
          profession?: string | null
          q1?: number | null
          q10?: number | null
          q11?: number | null
          q12?: number | null
          q13?: number | null
          q14?: number | null
          q15?: number | null
          q16?: number | null
          q17?: number | null
          q18?: number | null
          q19?: number | null
          q2?: number | null
          q20?: number | null
          q21?: number | null
          q22?: number | null
          q23?: number | null
          q24?: number | null
          q25?: number | null
          q26?: number | null
          q27?: number | null
          q28?: number | null
          q29?: number | null
          q3?: number | null
          q30?: number | null
          q31?: number | null
          q32?: number | null
          q33?: number | null
          q34?: number | null
          q35?: number | null
          q36?: number | null
          q4?: number | null
          q5?: number | null
          q6?: number | null
          q7?: number | null
          q8?: number | null
          q9?: number | null
          question_responses?: Json | null
          workshop_id?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
