import { GetStaticProps } from "next"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { api } from "../services/api"
import { ConvertDurationToTimeString } from "../utils/convertDurationToTimeString"

import styles from './home.module.scss'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  published_at: string;
  duration: number;
  duration_as_string: string;
  description: string;
  url: string;
}

type HomeProps = {
  latest_episodes: Episode[]
  all_episodes: Episode[]
}

export default function Home({ latest_episodes, all_episodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latest_episodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title} 
                  objectFit='cover'
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.duration_as_string}</span>
                </div>

                <button type='button'>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>

          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>
            <tbody>
              {
                all_episodes.map(
                  episode => {
                    return (
                      <tr key={episode.id}>
                        <td style={{ width: 75 }}>
                          <Image 
                            width={120}
                            height={120}
                            src={episode.thumbnail}
                            alt={episode.title}
                            objectFit='cover'
                          />
                        </td>
                        <td><a href={`/episodes/${episode.id}`}>{episode.title}</a></td>
                        <td>{episode.members}</td>
                        <td style={{ width: 100 }}>{episode.published_at}</td>
                        <td>{episode.duration_as_string}</td>
                        <td>
                          <button type='button'>
                            <img src="/play-green.svg" alt="Tocar episódio"/>
                          </button>
                        </td>
                      </tr>
                    )
                  }
                )
              }
            </tbody>
          </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      published_at: format(
        parseISO(episode.published_at),
        'd MMM yy',
        { locale: ptBR },
      ),
      duration: Number(episode.file.duration),
      duration_as_string: ConvertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  const latest_episodes = episodes.slice(0, 2)
  const all_episodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latest_episodes,
      all_episodes,
    },
    revalidate: 60 * 60 * 8, //8 horas
  }
}
